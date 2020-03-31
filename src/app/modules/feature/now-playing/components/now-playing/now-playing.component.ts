import { Component } from '@angular/core';
import { setAltSrc } from '@utilities';
import { Store, select } from '@ngrx/store';
import { RootState } from '@core';
import {
  addCurrentStationToFavoritesRequested,
  removeCurrentStationFromFavoritesRequested,
  selectIsProcessingFavoritesForCurrentStation,
  selectIsCurrentStationInFavorites,
  selectCurrentStationFavoritesProcessingState
} from '@core/store/favorite-stations';
import { KeepAwakeService } from '@core';
import { setSleepTimerSubmit, clearSleepTimer, selectMinutesUntilSleep } from '@core/store/sleep-timer';
import {
  selectCurrentStation,
  selectStreamInfo,
  selectStreamInfoStatus,
  selectPlayerStatus,
  playAudioStart,
  pauseAudioSubmit,
  selectStreamInfoTitle,
  selectIsStreamInfoPresent
} from '@core/store/player';
import { PlayerStatus, StreamInfoStatus } from '@core/models/player';

@Component({
  templateUrl: './now-playing.component.html',
  styleUrls: ['./now-playing.component.scss']
})
export class NowPlayingComponent {
  constructor(
    public keepAwakeService: KeepAwakeService,
    private store: Store<RootState>
  ) {}

  public streamInfoStatus = StreamInfoStatus;
  public playerStatus = PlayerStatus;
  public processingFavorites$ = this.store.pipe(select(selectIsProcessingFavoritesForCurrentStation));
  public favoritesProcessingState$ = this.store.pipe(select(selectCurrentStationFavoritesProcessingState));
  public isCurrentStationInFavorites$ = this.store.pipe(select(selectIsCurrentStationInFavorites));
  public playerStatus$ = this.store.pipe(select(selectPlayerStatus));
  public currentStation$ = this.store.pipe(select(selectCurrentStation));
  public streamInfoPresent$ = this.store.pipe(select(selectIsStreamInfoPresent));
  public streamInfo$ = this.store.pipe(select(selectStreamInfo));
  public streamInfoTitle$ = this.store.pipe(select(selectStreamInfoTitle));
  public streamInfoStatus$ = this.store.pipe(select(selectStreamInfoStatus));
  public minutesUntilSleep$ = this.store.pipe(select(selectMinutesUntilSleep));

  public onImgError(img: HTMLImageElement, altSrc: string) {
    setAltSrc(img, altSrc);
  }

  public onTimerSelected(minutes: number) {
    if (minutes != null) {
      this.store.dispatch(setSleepTimerSubmit({minutes}));
    } else {
      this.store.dispatch(clearSleepTimer());
    }
  }

  public onAddToFavoritesClicked(): void {
    this.store.dispatch(addCurrentStationToFavoritesRequested());
  }

  public onRemoveFromFavoritesClicked(): void {
    this.store.dispatch(removeCurrentStationFromFavoritesRequested());
  }

  public onPlayClicked(): void {
    this.store.dispatch(playAudioStart());
  }

  public onPauseClicked(): void {
    this.store.dispatch(pauseAudioSubmit());
  }
}
