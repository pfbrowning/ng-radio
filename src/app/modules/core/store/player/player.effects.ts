import { Injectable, Inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { StreamInfoService } from '../../services/stream-info.service';
import { tap, map, switchMap, catchError, withLatestFrom, takeUntil, mapTo, filter, take } from 'rxjs/operators';
import { from, of, timer } from 'rxjs';
import { NotificationService } from '../../services/notification.service';
import { Severities } from '../../models/notifications/severities';
import { Store, select } from '@ngrx/store';
import { ConfigService } from '../../services/config.service';
import { Title } from '@angular/platform-browser';
import {
  selectCurrentStationUrl,
  selectCurrentStationAndStreamInfo,
  selectStreamInfo,
  selectCurrentStationValidationState,
  selectCurrentStationUrlAndItsValidationState
} from './player.selectors';
import {
  selectStation,
  playAudioStart,
  playAudioSucceeded,
  playAudioFailed,
  pauseAudioSubmit,
  fetchStreamInfoStart,
  fetchStreamInfoSucceeded,
  audioPaused,
  fetchStreamInfoFailed,
  validateStreamStart,
  validateStreamSucceeded,
  validateStreamFailed,
  validateStreamSubmit
} from './player-actions';
import { RootState } from '../../models/root-state';
import { goToSleep } from '../sleep-timer/sleep-timer.actions';
import { CurrentTimeService } from '../../services/current-time.service';
import { AudioElement } from '../../models/player/audio-element';
import { AudioElementToken } from '../../injection-tokens/audio-element-token';
import { StreamValidatorService } from '../../services/player/stream-validator.service';
import isBlank from 'is-blank';
import isEqual from 'lodash/isEqual';

@Injectable()
export class PlayerEffects {
  constructor(
    private actions$: Actions,
    private store: Store<RootState>,
    private notificationService: NotificationService,
    private streamInfoService: StreamInfoService,
    private configService: ConfigService,
    private titleService: Title,
    private streamValidatorService: StreamValidatorService,
    private currentTimeService: CurrentTimeService,
    @Inject(AudioElementToken) private audio: AudioElement
  ) { }

  listenForAudioPaused$ = createEffect(() =>
    this.audio.paused.pipe(map(() => audioPaused()))
  );

  selectStation$ = createEffect(() => this.actions$.pipe(
    ofType(selectStation),
    tap(action => {
      // Regardless of validation state, pause any playing audio and set the url & site title
      this.audio.pause();
      /* Include a timestamp query param because Firefox doesn't play well with
      some previously-buffered streams */
      const url = new URL(action.station.url);
      url.searchParams.append('t', this.currentTimeService.unix().toString());
      this.audio.src = url.toString();

      if (!isBlank(action.station.title)) {
        this.titleService.setTitle(action.station.title);
      } else {
        this.titleService.setTitle('Browninglogic Radio');
      }
    }),
    switchMap(action => {
      // Validate the stream if it isn't already validated or in progress
      this.store.dispatch(validateStreamSubmit({streamUrl: action.station.url}));
      // Wait for the stream to be successfully validated if it isn't already
      return this.store.pipe(
        select(selectCurrentStationUrlAndItsValidationState),
        /* Don't proceed at all if the station changes before validation succeeds or fails.
        Otherwise wait until the state represents that validation is not in progress and
        either succeded or failed. */
        filter(selected => selected.url === action.station.url
          && selected.validationState != null
          && !selected.validationState.inProgress
          && (selected.validationState.validatedUrl != null || selected.validationState.failureReason != null)
        ),
        take(1),
        map(selected => selected.validationState),
        tap(vs => {
          if (vs.failureReason != null) {
            this.notificationService.notify(Severities.Error, 'Failed To Validate Stream', `Can't play ${action.station.url}.`);
          }
        }),
        filter(vs => vs.validatedUrl != null),
        /* If the URL was validated as provided, then directly start playback.
        Otherwise dispatch selectStation with the new URL so that the validated url is
        reduced and set properly. */
        map(vs => action.station.url === vs.validatedUrl
          ? playAudioStart()
          : selectStation({station: { ... action.station, url: vs.validatedUrl }})
        )
      );
    })
  ));

  validateStreamSubmit$ = createEffect(() => this.actions$.pipe(
    ofType(validateStreamSubmit),
    withLatestFrom(this.store.pipe(select(selectCurrentStationValidationState))),
    // Start validation only if it's not already validated and not currently in progress
    filter(([action, vs]) => vs == null || (vs.validatedUrl == null && !vs.inProgress)),
    map(([action, vs]) => validateStreamStart({streamUrl: action.streamUrl}))
  ));

  validateStream$ = createEffect(() => this.actions$.pipe(
    ofType(validateStreamStart),
    switchMap(action => this.streamValidatorService.validateStream(action.streamUrl).pipe(
      map(validatedUrl => validateStreamSucceeded({streamUrl: action.streamUrl, validatedUrl})),
      catchError(error => of(validateStreamFailed({
        streamUrl: action.streamUrl,
        reason: error.failureReason,
        error: error.error
      })))
    ))
  ));

  playStation$ = createEffect(() => this.actions$.pipe(
    ofType(playAudioStart),
    switchMap(() => from(this.audio.play()).pipe(
      map(() => playAudioSucceeded()),
      catchError(error => of(playAudioFailed({error})))
    ))
  ));

  pauseAudio$ = createEffect(() => this.actions$.pipe(
    ofType(pauseAudioSubmit),
    tap(() => this.audio.pause())
  ), { dispatch: false });

  pauseOnGoToSleep$ = createEffect(() => this.actions$.pipe(
    ofType(goToSleep),
    map(() => pauseAudioSubmit())
  ));

  notifyPlayAudioFailed$ = createEffect(() => this.actions$.pipe(
    ofType(playAudioFailed),
    tap(action => this.notificationService.notify(Severities.Error, 'Failed To Play Audio', action.error.message))
  ), { dispatch: false });

  fetchOnPlaySucceeded$ = createEffect(() => this.actions$.pipe(
    ofType(playAudioSucceeded),
    withLatestFrom(this.store.pipe(select(selectCurrentStationUrl))),
    map(([action, streamUrl]) => fetchStreamInfoStart({streamUrl}))
  ));

  fetchOnInterval$ = createEffect(() => this.actions$.pipe(
    ofType(fetchStreamInfoSucceeded, fetchStreamInfoFailed),
    withLatestFrom(this.store.pipe(select(selectCurrentStationUrl))),
    switchMap(([action, streamUrl]) => timer(this.configService.appConfig.metadataRefreshInterval).pipe(
        takeUntil(this.actions$.pipe(ofType(selectStation, audioPaused))),
        mapTo(fetchStreamInfoStart({streamUrl})
    )),
  )));

  fetchStreamInfo$ = createEffect(() => this.actions$.pipe(
    ofType(fetchStreamInfoStart),
    switchMap(action => this.streamInfoService.getMetadata(action.streamUrl).pipe(
      takeUntil(this.actions$.pipe(ofType(selectStation, audioPaused))),
      withLatestFrom(this.store.pipe(select(selectStreamInfo))),
      map(([fetched, selected]) => fetchStreamInfoSucceeded({
        streamUrl: action.streamUrl,
        streamInfo: fetched,
        streamInfoChanged: !isEqual(fetched, selected)
      })),
      catchError(error => of(fetchStreamInfoFailed({streamUrl: action.streamUrl, error})))
    ))
  ));

  notifyStreamInfoChanged$ = createEffect(() => this.actions$.pipe(
    ofType(fetchStreamInfoSucceeded),
    filter(action => action.streamInfoChanged),
    withLatestFrom(this.store.pipe(select(selectCurrentStationAndStreamInfo))),
    tap(([action, selected]) => {
      this.notificationService.notify(Severities.Info, 'Now Playing', !isBlank(selected.streamInfo.title) ?
      `${selected.streamInfo.title} - ${selected.station.title}` : selected.station.title);
    })
  ), { dispatch: false });

  updateTitleOnStreamInfoChanged$ = createEffect(() => this.actions$.pipe(
    ofType(fetchStreamInfoSucceeded),
    filter(action => action.streamInfoChanged),
    withLatestFrom(this.store.pipe(select(selectCurrentStationAndStreamInfo))),
    tap(([action, selected]) => {
      if (!isBlank(selected.streamInfo.title)) {
        this.titleService.setTitle(selected.streamInfo.title);
      } else if (!isBlank(selected.station.title)) {
        this.titleService.setTitle(selected.station.title);
      } else {
        this.titleService.setTitle('Browninglogic Radio');
      }
    })
  ), { dispatch: false });

  clearTitle$ = createEffect(() => this.actions$.pipe(
    ofType(fetchStreamInfoFailed, audioPaused),
    tap(() => this.titleService.setTitle('Browninglogic Radio'))
  ), { dispatch: false });
}
