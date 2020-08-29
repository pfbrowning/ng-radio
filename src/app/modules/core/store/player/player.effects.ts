import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { tap, map, switchMap, catchError, withLatestFrom, filter, distinctUntilChanged, debounceTime } from 'rxjs/operators';
import { of, combineLatest } from 'rxjs';
import { Store } from '@ngrx/store';
import { Title } from '@angular/platform-browser';
import {
  selectStation,
  playAudioStart,
  playAudioSucceeded,
  playAudioFailed,
  audioPaused,
} from './player-actions';
import { RootState } from '../../models/root-state';
import { PlayerActions } from '.';
import { PlayerStatus } from '../../models/player/player-status';
import { isEqual } from 'lodash-es';
import { RadioPlayerService } from '../../services/radio-player/radio-player.service';
import { LoggingService, NotificationsService, SleepTimerService, AudioElementService } from '@core/services';
import { StreamMetadataFacadeService } from '../stream-metadata/stream-metadata-facade.service';
import { PlayerFacadeService } from './player-facade.service';
import isFalsyOrWhitespace from 'is-falsy-or-whitespace';
import * as PlayerBarActions from '../dispatch-facades/player-bar/player-bar.actions';

@Injectable()
export class PlayerEffects {
  constructor(
    private actions$: Actions,
    private store: Store<RootState>,
    private notificationsService: NotificationsService,
    private loggingService: LoggingService,
    private titleService: Title,
    private sleepTimerService: SleepTimerService,
    private audio: AudioElementService,
    private radioPlayerService: RadioPlayerService,
    private playerFacade: PlayerFacadeService,
    private metadataFacade: StreamMetadataFacadeService
  ) { }

  listenForAudioPaused$ = createEffect(() => this.audio.paused.pipe(
    map(() => PlayerActions.audioPaused())
  ));

  playOnPlayClicked$ = createEffect(() => this.actions$.pipe(
    ofType(PlayerBarActions.playClicked),
    map(() => PlayerActions.playAudioStart())
  ));

  selectStation$ = createEffect(() => this.actions$.pipe(
    ofType(selectStation),
    tap(action => {
      // Pause any playing audio and set the url & site title
      this.audio.pause();

      if (!isFalsyOrWhitespace(action.station.title)) {
        this.titleService.setTitle(action.station.title);
      } else {
        this.titleService.setTitle('Browninglogic Radio');
      }
    }),
    map(() => PlayerActions.playAudioStart())
  ));

  playStation$ = createEffect(() => this.actions$.pipe(
    ofType(playAudioStart),
    withLatestFrom(this.playerFacade.currentStation$),
    switchMap(([, station]) => this.radioPlayerService.play(station.url).pipe(
      map(() => playAudioSucceeded()),
      catchError(error => of(playAudioFailed({error, station})))
    ))
  ));

  pauseOnPauseClicked$ = createEffect(() => this.actions$.pipe(
    ofType(PlayerBarActions.pauseClicked),
    tap(() => this.audio.pause())
  ), { dispatch: false });

  pauseOnGoToSleep$ = createEffect(() => this.sleepTimerService.sleepTimer$.pipe(
    map(() => this.audio.pause())
  ), { dispatch: false });

  notifyLogPlayAudioFailed$ = createEffect(() => this.actions$.pipe(
    ofType(playAudioFailed),
    tap(({station, error}) => {
      this.notificationsService.error('Failed To Play Audio', error.message);
      this.loggingService.warn('Failed To Play Audio', { station, error });
    })
  ), { dispatch: false });

  onCurrentMetadataChanged$ = createEffect(() => combineLatest([
    this.metadataFacade.metadataForCurrentStation$,
    this.playerFacade.currentStation$,
    this.playerFacade.playerStatus$
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
