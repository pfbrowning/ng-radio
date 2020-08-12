import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { tap, map, switchMap, catchError, withLatestFrom, filter, mergeMap, distinctUntilChanged, debounceTime } from 'rxjs/operators';
import { of, combineLatest } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { Title } from '@angular/platform-browser';
import {
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
} from './player-actions';
import { RootState } from '../../models/root-state';
import { PlayerActions, PlayerSelectors } from '.';
import { PlayerStatus } from '../../models/player/player-status';
import { StreamPreprocessorFailureReason } from '../../models/player/stream-preprocessor-failure-reason';
import { StreamPreprocessorService } from '../../services/preprocessing/stream-preprocessor.service';
import { isEqual } from 'lodash-es';
import { isFalsyOrWhitespace } from '@utilities';
import { RadioPlayerService } from '../../services/radio-player/radio-player.service';
import { LoggingService, NotificationsService, SleepTimerService, AudioElementService } from '@core/services';
import { StreamMetadataFacadeService } from '../stream-metadata/stream-metadata-facade.service';

@Injectable()
export class PlayerEffects {
  constructor(
    private actions$: Actions,
    private store: Store<RootState>,
    private notificationsService: NotificationsService,
    private loggingService: LoggingService,
    private titleService: Title,
    private streamPreprocessorService: StreamPreprocessorService,
    private sleepTimerService: SleepTimerService,
    private audio: AudioElementService,
    private radioPlayerService: RadioPlayerService,
    private metadataFacade: StreamMetadataFacadeService
  ) { }

  listenForAudioPaused$ = createEffect(() => this.audio.paused.pipe(
    map(() => PlayerActions.audioPaused())
  ));

  selectStation$ = createEffect(() => this.actions$.pipe(
    ofType(selectStation),
    withLatestFrom(this.store.pipe(select(selectCurrentStationUrlAndItsValidationState))),
    tap(([action]) => {
      // Regardless of validation state, pause any playing audio and set the url & site title
      this.audio.pause();

      if (!isFalsyOrWhitespace(action.station.title)) {
        this.titleService.setTitle(action.station.title);
      } else {
        this.titleService.setTitle('Browninglogic Radio');
      }
    }),
    map(([{station}, {validationState}]) => {
      if (validationState && validationState.validatedUrl) {
        // If the station url has already been successfully validated, then start playing
        if (validationState.validatedUrl === station.url) {
          return PlayerActions.playAudioStart();
        }
        // If a different url has been validated for the selected station, then reselect with the validated url
        return PlayerActions.selectStation({station: { ...station, url: validationState.validatedUrl }});
      }
      // If this station hasn't been successfully validated at all, then start preprocessing
      return PlayerActions.preprocessStreamStart({streamUrl: station.url});
    })
  ));

  onStreamPreprocessSucceeded$ = createEffect(() => this.actions$.pipe(
    ofType(PlayerActions.preprocessStreamSucceeded),
    withLatestFrom(this.store.pipe(select(PlayerSelectors.selectCurrentStation))),
    filter(([action, station]) => action.streamUrl === station.url),
    map(([{ streamUrl, validatedUrl }, station]) => streamUrl === validatedUrl
      ? PlayerActions.playAudioStart()
      : PlayerActions.selectStation({station: {
        ...station,
        url: validatedUrl
      }})
    )
  ));

  onStreamPreprocessFailed$ = createEffect(() => this.actions$.pipe(
    ofType(PlayerActions.preprocessStreamFailed),
    withLatestFrom(this.store.pipe(select(PlayerSelectors.selectCurrentStation))),
    filter(([action, station]) => action.streamUrl === station.url),
    tap(([action]) => this.notificationsService.error('Failed To Validate Stream', `Can't play ${action.streamUrl}.`))
  ), { dispatch: false });

  preprocessStream$ = createEffect(() => this.actions$.pipe(
    ofType(PlayerActions.preprocessStreamStart),
    mergeMap(action => this.streamPreprocessorService.preprocessStream(action.streamUrl).pipe(
      map(validatedUrl => PlayerActions.preprocessStreamSucceeded({streamUrl: action.streamUrl, validatedUrl})),
      catchError(error => of(PlayerActions.preprocessStreamFailed({
        details: { ...error, reason: undefined, error: undefined },
        streamUrl: action.streamUrl,
        reason: error.reason || StreamPreprocessorFailureReason.NoReasonGiven,
        error: error.error
      })))
    ))
  ));

  playStation$ = createEffect(() => this.actions$.pipe(
    ofType(playAudioStart),
    withLatestFrom(this.store.pipe(select(selectCurrentStation))),
    switchMap(([, station]) => this.radioPlayerService.play(station.url).pipe(
      map(() => playAudioSucceeded()),
      catchError(error => of(playAudioFailed({error, station})))
    ))
  ));

  pauseAudio$ = createEffect(() => this.actions$.pipe(
    ofType(pauseAudioSubmit),
    tap(() => this.audio.pause())
  ), { dispatch: false });

  pauseOnGoToSleep$ = createEffect(() => this.sleepTimerService.sleepTimer$.pipe(
    map(() => pauseAudioSubmit())
  ));

  notifyLogPlayAudioFailed$ = createEffect(() => this.actions$.pipe(
    ofType(playAudioFailed),
    tap(({station, error}) => {
      this.notificationsService.error('Failed To Play Audio', error.message);
      this.loggingService.warn('Failed To Play Audio', { station, error });
    })
  ), { dispatch: false });

  logFailedToValidateStream$ = createEffect(() => this.actions$.pipe(
    ofType(PlayerActions.preprocessStreamFailed),
    tap(({streamUrl, reason, error, details}) =>
      this.loggingService.warn('Failed To Validate Stream', { streamUrl, reason, error, details })
    )
  ), { dispatch: false });

  onCurrentMetadataChanged$ = createEffect(() => combineLatest([
    this.metadataFacade.metadataForCurrentStation$,
    this.store.pipe(select(PlayerSelectors.selectCurrentStation)),
    this.store.pipe(select(PlayerSelectors.selectPlayerStatus))
  ]).pipe(
    debounceTime(0),
    filter(([, , status]) => status === PlayerStatus.Playing),
    map(([metadataTitle, station]) => ({ stationTitle: station.title, metadataTitle })),
    distinctUntilChanged((x, y) => isEqual(x, y)),
    tap(meta => {
      if (!isFalsyOrWhitespace(meta.metadataTitle)) {
        this.titleService.setTitle(meta.metadataTitle);
      } else if (!isFalsyOrWhitespace(meta.stationTitle)) {
        this.titleService.setTitle(meta.stationTitle);
      } else {
        this.titleService.setTitle('Browninglogic Radio');
      }

      this.notificationsService.info('Now Playing',
        !isFalsyOrWhitespace(meta.metadataTitle)
          ? `${meta.metadataTitle} - ${meta.stationTitle}`
          : meta.stationTitle
      );
    })
  ), { dispatch: false });

  clearTitle$ = createEffect(() => this.actions$.pipe(
    ofType(audioPaused),
    tap(() => this.titleService.setTitle('Browninglogic Radio'))
  ), { dispatch: false });
}
