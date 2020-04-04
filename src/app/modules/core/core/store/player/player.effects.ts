import { Injectable, Inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { StreamInfoService } from '../../services/stream-info.service';
import { AudioElement } from '../../services/audio-element';
import { AudioElementToken } from '../../injection-tokens/audio-element-token';
import { tap, map, switchMap, catchError, withLatestFrom, takeUntil, mapTo, filter } from 'rxjs/operators';
import { from, of, timer } from 'rxjs';
import { NotificationService, Severities } from '@notifications';
import { Store, select } from '@ngrx/store';
import { selectCurrentStationUrl, selectCurrentStationAndStreamInfo, selectStreamInfo } from './player.selectors';
import { ConfigService } from '@config';
import { Title } from '@angular/platform-browser';
import isEqual from 'lodash/isEqual';
import {
  selectStation,
  playAudioStart,
  playAudioSucceeded,
  playAudioFailed,
  pauseAudioSubmit,
  fetchStreamInfoStart,
  fetchStreamInfoSucceeded,
  audioPaused,
  fetchStreamInfoFailed
} from './player-actions';
import { RootState } from '../../models/root-state';
import { goToSleep } from '../sleep-timer/sleep-timer.actions';
import isBlank from 'is-blank';

@Injectable()
export class PlayerEffects {
  constructor(
    private actions$: Actions,
    private store: Store<RootState>,
    private notificationService: NotificationService,
    private streamInfoService: StreamInfoService,
    private configService: ConfigService,
    private titleService: Title,
    @Inject(AudioElementToken) private audio: AudioElement
  ) {}

  listenForAudioPaused$ = createEffect(() =>
    this.audio.paused.pipe(map(() => audioPaused()))
  );

  selectStation$ = createEffect(() => this.actions$.pipe(
    ofType(selectStation),
    tap(action => {
      this.audio.src = action.station.url;
      if (!isBlank(action.station.title)) {
        this.titleService.setTitle(action.station.title);
      } else {
        this.titleService.setTitle('Browninglogic Radio');
      }
    }),
    map(() => playAudioStart())
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
