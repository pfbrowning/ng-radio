import { Injectable, Inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { StreamInfoService } from '../../services/stream-info.service';
import { tap, map, switchMap, catchError, withLatestFrom, takeUntil, mapTo, filter, take, mergeMap } from 'rxjs/operators';
import { from, of, timer } from 'rxjs';
import { NotificationService } from '../../services/notification.service';
import { Severities } from '../../models/notifications/severities';
import { Store, select, Action } from '@ngrx/store';
import { ConfigService } from '../../services/config.service';
import { Title } from '@angular/platform-browser';
import {
  selectCurrentStationValidationState,
  selectCurrentStationUrlAndItsValidationState,
  selectCurrentStation,
} from './player.selectors';
import {
  selectStation,
  playAudioStart,
  playAudioSucceeded,
  playAudioFailed,
  pauseAudioSubmit,
  audioPaused,
  validateStreamStart,
  validateStreamSucceeded,
  validateStreamFailed,
  validateStreamSubmit,
  fetchIntervalStart,
  fetchNowPlayingStart,
  fetchNowPlayingSucceeded,
  fetchNowPlayingFailed,
} from './player-actions';
import { RootState } from '../../models/root-state';
import { goToSleep } from '../sleep-timer/sleep-timer.actions';
import { CurrentTimeService } from '../../services/current-time.service';
import { AudioElement } from '../../models/player/audio-element';
import { AudioElementToken } from '../../injection-tokens/audio-element-token';
import { StreamValidatorService } from '../../services/player/stream-validator.service';
import { StreamValidationFailureReason } from '../../models/player/stream-validation-failure-reason';
import { LoggingService } from '../../services/logging.service';
import { PlayerActions, PlayerSelectors } from './index';
import { PlayerStatus } from '../../models/player/player-status';
import isBlank from 'is-blank';
import isEqual from 'lodash/isEqual';

@Injectable()
export class PlayerEffects {
  constructor(
    private actions$: Actions,
    private store: Store<RootState>,
    private notificationService: NotificationService,
    private loggingService: LoggingService,
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
    filter(([, vs]) => vs == null || (vs.validatedUrl == null && !vs.inProgress)),
    map(([action]) => validateStreamStart({streamUrl: action.streamUrl}))
  ));

  validateStream$ = createEffect(() => this.actions$.pipe(
    ofType(validateStreamStart),
    switchMap(action => this.streamValidatorService.validateStream(action.streamUrl).pipe(
      map(validatedUrl => validateStreamSucceeded({streamUrl: action.streamUrl, validatedUrl})),
      catchError(error => of(validateStreamFailed({
        details: { ...error, reason: undefined, error: undefined },
        streamUrl: action.streamUrl,
        reason: error.reason || StreamValidationFailureReason.NoReasonGiven,
        error: error.error
      })))
    ))
  ));

  playStation$ = createEffect(() => this.actions$.pipe(
    ofType(playAudioStart),
    withLatestFrom(this.store.pipe(select(selectCurrentStation))),
    switchMap(([, station]) => from(this.audio.play()).pipe(
      map(() => playAudioSucceeded()),
      catchError(error => of(playAudioFailed({error, station})))
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

  notifyLogPlayAudioFailed$ = createEffect(() => this.actions$.pipe(
    ofType(playAudioFailed),
    tap(({station, error}) => {
      this.notificationService.notify(Severities.Error, 'Failed To Play Audio', error.message);
      this.loggingService.logWarning('Failed To Play Audio', { station, error });
    })
  ), { dispatch: false });

  logFailedToValidateStream$ = createEffect(() => this.actions$.pipe(
    ofType(validateStreamFailed),
    tap(({streamUrl, reason, error, details}) =>
      this.loggingService.logWarning('Failed To Validate Stream', { streamUrl, reason, error, details })
    )
  ), { dispatch: false });

  fetchOnPlaySucceeded$ = createEffect(() => this.actions$.pipe(
    ofType(playAudioSucceeded),
    withLatestFrom(this.store.pipe(select(PlayerSelectors.currentUrlAndFetchInProgressUrls))),
    filter(([, {current, fetching}]) => !fetching.includes(current)),
    map(([, {current}]) => fetchNowPlayingStart({streamUrl: current}))
  ));

  fetchOnListSelected$ = createEffect(() => this.actions$.pipe(
    ofType(PlayerActions.selectStreamInfoUrls),
    withLatestFrom(this.store.pipe(select(PlayerSelectors.nonIntervalOrFetchingStreamInfoUrls))),
    switchMap(([, urls]) => urls.map(streamUrl => PlayerActions.fetchNowPlayingStart({streamUrl})))
  ));

  startFetchInterval$ = createEffect(() => this.actions$.pipe(
    ofType(PlayerActions.fetchNowPlayingSucceeded, PlayerActions.fetchNowPlayingFailed),
    withLatestFrom(this.store.pipe(select(PlayerSelectors.currentAndStreamInfoUrls))),
    filter(([{streamUrl}, {current, listed}]) => listed.concat(current).includes(streamUrl)),
    mergeMap(([action, selected]) => this.configService.appConfig$.pipe(
      map(config => ({ action, selected, config }))
    )),
    map(({ action, selected, config }) => fetchIntervalStart({
      streamUrl: action.streamUrl,
      duration: selected.current === action.streamUrl
        ? config.currentStationRefreshInterval
        : config.listedStationRefreshInterval
    }))
  ));

  fetchInterval$ = createEffect(() => this.actions$.pipe(
    ofType(PlayerActions.fetchIntervalStart),
    mergeMap(({streamUrl, duration}) => timer(duration).pipe(
      takeUntil(this.actions$.pipe(
        ofType(PlayerActions.fetchNowPlayingStart),
        filter(action => action.streamUrl === streamUrl)
      )),
      mapTo(PlayerActions.fetchIntervalCompleted({streamUrl})
    )),
  )));

  onFetchIntervalComplete$ = createEffect(() => this.actions$.pipe(
    ofType(PlayerActions.fetchIntervalCompleted),
    withLatestFrom(this.store.pipe(select(PlayerSelectors.intervalCompletedParams))),
    filter(([{streamUrl}, {listed, current, status}]) =>
      listed.includes(streamUrl) || (current === streamUrl && status === PlayerStatus.Playing)
    ),
    map(([{streamUrl}]) => PlayerActions.fetchNowPlayingStart({streamUrl}))
  ));

  fetchStreamInfo$ = createEffect(() => this.actions$.pipe(
    ofType(PlayerActions.fetchNowPlayingStart),
    mergeMap(({streamUrl}) => this.streamInfoService.getMetadata(streamUrl).pipe(
      withLatestFrom(this.store.pipe(select(PlayerSelectors.selectCurrentStationAndNowPlaying))),
      switchMap(([fetched, selected]) => {
        const actions: Action[] = [ fetchNowPlayingSucceeded({streamUrl, nowPlaying: fetched}) ];
        if (selected.station && streamUrl === selected.station.url && !isEqual(fetched, selected.nowPlaying)) {
          actions.push(PlayerActions.currentNowPlayingChanged({streamUrl, nowPlaying: fetched}));
        }
        return actions;
      }),
      catchError(error => {
        return of(fetchNowPlayingFailed({streamUrl, error}));
      })
    ))
  ));

  notifyStreamInfoChanged$ = createEffect(() => this.actions$.pipe(
    ofType(PlayerActions.currentNowPlayingChanged),
    withLatestFrom(this.store.pipe(select(PlayerSelectors.selectCurrentStation))),
    tap(([{nowPlaying}, station]) => {
      this.notificationService.notify(Severities.Info, 'Now Playing', !isBlank(nowPlaying.title) ?
      `${nowPlaying.title} - ${station.title}` : station.title);
    })
  ), { dispatch: false });

  logFetchNowPlayingFailed$ = createEffect(() => this.actions$.pipe(
    ofType(PlayerActions.fetchNowPlayingFailed),
    tap(({error, streamUrl}) => this.loggingService.logWarning('Fetch Now Playing Failed', { streamUrl, error }))
  ), { dispatch: false });

  updateTitleOnStreamInfoChanged$ = createEffect(() => this.actions$.pipe(
    ofType(PlayerActions.currentNowPlayingChanged),
    withLatestFrom(this.store.pipe(select(PlayerSelectors.selectCurrentStation))),
    tap(([{nowPlaying}, station]) => {
      if (!isBlank(nowPlaying.title)) {
        this.titleService.setTitle(nowPlaying.title);
      } else if (!isBlank(station.title)) {
        this.titleService.setTitle(station.title);
      } else {
        this.titleService.setTitle('Browninglogic Radio');
      }
    })
  ), { dispatch: false });

  clearTitle$ = createEffect(() => this.actions$.pipe(
    ofType(fetchNowPlayingFailed, audioPaused),
    tap(() => this.titleService.setTitle('Browninglogic Radio'))
  ), { dispatch: false });
}
