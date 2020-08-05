import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { tap, map, switchMap, catchError, withLatestFrom, takeUntil, mapTo, filter, mergeMap } from 'rxjs/operators';
import { of, timer, merge } from 'rxjs';
import { Store, select, Action } from '@ngrx/store';
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
import { CurrentTimeService } from '../../services/current-time.service';
import { PlayerActions, PlayerSelectors } from '.';
import { PlayerStatus } from '../../models/player/player-status';
import { StreamPreprocessorFailureReason } from '../../models/player/stream-preprocessor-failure-reason';
import { StreamPreprocessorService } from '../../services/preprocessing/stream-preprocessor.service';
import { isEqual } from 'lodash-es';
import { isFalsyOrWhitespace } from '@utilities';
import { WindowFocusService } from '../../services/browser-apis/window-focus.service';
import { WindowService } from '../../services/browser-apis/window.service';
import { LoggingService, NotificationsService, SleepTimerService, AudioElementService, ConfigService } from '@core/services';

@Injectable()
export class PlayerEffects {
  constructor(
    private actions$: Actions,
    private store: Store<RootState>,
    private notificationsService: NotificationsService,
    private loggingService: LoggingService,
    private configService: ConfigService,
    private titleService: Title,
    private streamPreprocessorService: StreamPreprocessorService,
    private currentTimeService: CurrentTimeService,
    private windowService: WindowService,
    private windowFocusService: WindowFocusService,
    private sleepTimerService: SleepTimerService,
    private audio: AudioElementService,
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
    map(([action, selected]) => selected.validationState && selected.validationState.validatedUrl === action.station.url
      ? PlayerActions.playAudioStart()
      : PlayerActions.preprocessStreamStart({streamUrl: action.station.url})
    )
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
    withLatestFrom(
      this.store.pipe(select(selectCurrentStation)),
      this.configService.appConfig$
    ),
    tap(([, station, config]) => {
      /* Include a timestamp query param because Firefox doesn't play well with
      some previously-buffered streams */
      const url = new URL(`${config.radioProxyUrl}/stream`);
      url.searchParams.append('url', station.url);
      url.searchParams.append('t', this.currentTimeService.unix().toString());
      this.audio.src = url.toString();
    }),
    switchMap(([, station]) => this.audio.play().pipe(
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

  // /* TODO Rewrite this effect once everything else is working.  Use the state change itself, rather than an action,
  // as the trigger for the effect. */
  // notifyStreamInfoChanged$ = createEffect(() => this.actions$.pipe(
  //   ofType(PlayerActions.currentNowPlayingChanged),
  //   withLatestFrom(this.store.pipe(select(PlayerSelectors.selectCurrentStation))),
  //   tap(([{nowPlaying}, station]) => {
  //     this.notificationsService.info('Now Playing', !isFalsyOrWhitespace(nowPlaying.title) ?
  //     `${nowPlaying.title} - ${station.title}` : station.title);
  //   })
  // ), { dispatch: false });

  // // TODO Rewrite this as well
  // updateTitleOnStreamInfoChanged$ = createEffect(() => this.actions$.pipe(
  //   ofType(PlayerActions.currentNowPlayingChanged),
  //   withLatestFrom(this.store.pipe(select(PlayerSelectors.selectCurrentStation))),
  //   tap(([{nowPlaying}, station]) => {
  //     if (!isFalsyOrWhitespace(nowPlaying.title)) {
  //       this.titleService.setTitle(nowPlaying.title);
  //     } else if (!isFalsyOrWhitespace(station.title)) {
  //       this.titleService.setTitle(station.title);
  //     } else {
  //       this.titleService.setTitle('Browninglogic Radio');
  //     }
  //   })
  // ), { dispatch: false });

  // TODO Rewrite this
  // clearTitle$ = createEffect(() => this.actions$.pipe(
  //   ofType(fetchNowPlayingFailed, audioPaused),
  //   tap(() => this.titleService.setTitle('Browninglogic Radio'))
  // ), { dispatch: false });
}
