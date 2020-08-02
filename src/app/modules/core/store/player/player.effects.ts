import { Injectable, Inject, NgZone } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { tap, map, switchMap, catchError, withLatestFrom, takeUntil, mapTo, filter, mergeMap } from 'rxjs/operators';
import { from, of, timer, merge } from 'rxjs';
import { Severities } from '../../models/notifications/severities';
import { Store, select, Action } from '@ngrx/store';
import { ConfigService } from '../../services/config.service';
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
  fetchIntervalStart,
  fetchNowPlayingStart,
  fetchNowPlayingSucceeded,
  fetchNowPlayingFailed,
} from './player-actions';
import { RootState } from '../../models/root-state';
import { CurrentTimeService } from '../../services/current-time.service';
import { AudioElement } from '../../models/player/audio-element';
import { AudioElementToken } from '../../injection-tokens/audio-element-token';
import { PlayerActions, PlayerSelectors } from '.';
import { PlayerStatus } from '../../models/player/player-status';
import { StreamPreprocessorFailureReason } from '../../models/player/stream-preprocessor-failure-reason';
import { StreamPreprocessorService } from '../../services/preprocessing/stream-preprocessor.service';
import { isEqual } from 'lodash-es';
import { isFalsyOrWhitespace } from '@utilities';
import { WindowFocusService } from '../../services/browser-apis/window-focus.service';
import { WindowService } from '../../services/browser-apis/window.service';
import { LoggingService, StreamInfoService, NotificationService, SleepTimerService } from '@core/services';

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
    private streamPreprocessorService: StreamPreprocessorService,
    private currentTimeService: CurrentTimeService,
    private windowService: WindowService,
    private windowFocusService: WindowFocusService,
    private sleepTimerService: SleepTimerService,
    private ngZone: NgZone,
    @Inject(AudioElementToken) private audio: AudioElement
  ) { }

  listenForAudioPaused$ = createEffect(() => this.audio.paused.pipe(
    /* We have to explicitly dispatch this within the Angular zone in order for change detection
    to work properly because the HTML5 audio element which the event originated from was not in
    the Angular Zone. */
    tap(() => this.ngZone.run(() => this.store.dispatch(audioPaused())))
  ), { dispatch: false });

  selectStation$ = createEffect(() => this.actions$.pipe(
    ofType(selectStation),
    withLatestFrom(this.store.pipe(select(selectCurrentStationUrlAndItsValidationState))),
    tap(([action]) => {
      // Regardless of validation state, pause any playing audio and set the url & site title
      this.audio.pause();
      /* Include a timestamp query param because Firefox doesn't play well with
      some previously-buffered streams */
      const url = new URL(action.station.url);
      url.searchParams.append('t', this.currentTimeService.unix().toString());
      this.audio.src = url.toString();

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
    tap(([action]) => this.notificationService.notify(Severities.Error, 'Failed To Validate Stream', `Can't play ${action.streamUrl}.`))
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
    switchMap(([, station]) => from(this.audio.play()).pipe(
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
      this.notificationService.notify(Severities.Error, 'Failed To Play Audio', error.message);
      this.loggingService.warn('Failed To Play Audio', { station, error });
    })
  ), { dispatch: false });

  logFailedToValidateStream$ = createEffect(() => this.actions$.pipe(
    ofType(PlayerActions.preprocessStreamFailed),
    tap(({streamUrl, reason, error, details}) =>
      this.loggingService.warn('Failed To Validate Stream', { streamUrl, reason, error, details })
    )
  ), { dispatch: false });

  fetchOnPlaySucceeded$ = createEffect(() => this.actions$.pipe(
    ofType(playAudioSucceeded),
    withLatestFrom(this.store.pipe(select(PlayerSelectors.currentUrlAndFetchInProgressUrls))),
    filter(([, {current, fetching}]) => !fetching.includes(current)),
    map(([, {current}]) => fetchNowPlayingStart({streamUrl: current}))
  ));

  fetchListedStreamInfo$ = createEffect(() => merge(
    this.actions$.pipe(ofType(PlayerActions.selectStreamInfoUrls)),
    this.windowService.focus
  ).pipe(
    withLatestFrom(this.store.pipe(select(PlayerSelectors.nonIntervalOrFetchingStreamInfoUrls))),
    switchMap(([, urls]) => urls.map(streamUrl => PlayerActions.fetchNowPlayingStart({ streamUrl })))
  ));

  startFetchInterval$ = createEffect(() => this.actions$.pipe(
    ofType(PlayerActions.fetchNowPlayingSucceeded, PlayerActions.fetchNowPlayingFailed),
    withLatestFrom(
      this.store.pipe(select(PlayerSelectors.selectCurrentStationUrl)),
      this.store.pipe(select(PlayerSelectors.streamInfoUrls)),
      this.windowFocusService.focused$,
      this.configService.appConfig$
    ),
    filter(([{streamUrl}, current, listed]) => listed.concat(current).includes(streamUrl)),
    map(([action, current, , focused, config]) => fetchIntervalStart({
      streamUrl: action.streamUrl,
      duration: current === action.streamUrl && focused
        ? config.refreshIntervalShort
        : config.refreshIntervalLong
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
    withLatestFrom(
      this.store.pipe(select(PlayerSelectors.selectCurrentStationUrl)),
      this.store.pipe(select(PlayerSelectors.streamInfoUrls)),
      this.store.pipe(select(PlayerSelectors.selectPlayerStatus)),
      this.windowFocusService.focused$
    ),
    // Fetch listed streams only if the window is focused, but fetch the current playing stream regardless
    filter(([{streamUrl}, current, listed, status, focused]) =>
      (listed.includes(streamUrl) && focused) || (current === streamUrl && status === PlayerStatus.Playing)
    ),
    map(([{streamUrl}]) => PlayerActions.fetchNowPlayingStart({streamUrl}))
  ));

  fetchStreamInfo$ = createEffect(() => this.actions$.pipe(
    ofType(PlayerActions.fetchNowPlayingStart),
    mergeMap(({streamUrl}) => this.streamInfoService.getMetadata(streamUrl).pipe(
      withLatestFrom(this.store.pipe(select(PlayerSelectors.currentStationAndNowPlaying))),
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
      this.notificationService.notify(Severities.Info, 'Now Playing', !isFalsyOrWhitespace(nowPlaying.title) ?
      `${nowPlaying.title} - ${station.title}` : station.title);
    })
  ), { dispatch: false });

  logFetchNowPlayingFailed$ = createEffect(() => this.actions$.pipe(
    ofType(PlayerActions.fetchNowPlayingFailed),
    tap(({error, streamUrl}) => this.loggingService.warn('Fetch Now Playing Failed', { streamUrl, error }))
  ), { dispatch: false });

  updateTitleOnStreamInfoChanged$ = createEffect(() => this.actions$.pipe(
    ofType(PlayerActions.currentNowPlayingChanged),
    withLatestFrom(this.store.pipe(select(PlayerSelectors.selectCurrentStation))),
    tap(([{nowPlaying}, station]) => {
      if (!isFalsyOrWhitespace(nowPlaying.title)) {
        this.titleService.setTitle(nowPlaying.title);
      } else if (!isFalsyOrWhitespace(station.title)) {
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
