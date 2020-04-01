import { Component, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { setAltSrc } from '@utilities';
import { PlayerBarStationInfoComponent } from '../player-bar-station-info/player-bar-station-info.component';
import { Store, select } from '@ngrx/store';
import { KeepAwakeService, RootState } from '@core';
import { PlayerStatus } from '@core/models/player';
import { selectPlayerStatus, selectCurrentStation, playAudioStart, pauseAudioSubmit } from '@core/store/player';
import {
  selectIsCurrentStationInFavorites,
  selectCurrentStationFavoritesProcessingState,
  selectIsProcessingFavoritesForCurrentStation,
  addCurrentStationToFavoritesRequested,
  removeCurrentStationFromFavoritesRequested
} from '@core/store/favorite-stations';
import { selectMinutesUntilSleep, setSleepTimerSubmit, clearSleepTimer } from '@core/store/sleep-timer';
import { CurrentStationFavoritesProcessingState } from '@core/models/favorite-stations';

@Component({
  selector: 'blr-player-bar',
  templateUrl: './player-bar.component.html',
  styleUrls: ['./player-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlayerBarComponent {
  constructor(
    public keepAwakeService: KeepAwakeService,
    private router: Router,
    private store: Store<RootState>
  ) {}

  @ViewChild('stationInfo') stationInfo: PlayerBarStationInfoComponent;
  public playerStatus = PlayerStatus;
  public processingFavorites$ = this.store.pipe(select(selectIsProcessingFavoritesForCurrentStation));
  public favoritesProcessingState$ = this.store.pipe(select(selectCurrentStationFavoritesProcessingState));
  public isCurrentStationInFavorites$ = this.store.pipe(select(selectIsCurrentStationInFavorites));
  public playerStatus$ = this.store.pipe(select(selectPlayerStatus));
  public currentStation$ = this.store.pipe(select(selectCurrentStation));
  public minutesUntilSleep$ = this.store.pipe(select(selectMinutesUntilSleep));

  public onImgError(img: HTMLImageElement) {
    setAltSrc(img, '/assets/images/radio.svg');
  }

  public onTimerSelected(minutes: number) {
    if (minutes != null) {
      this.store.dispatch(setSleepTimerSubmit({minutes}));
    } else {
      this.store.dispatch(clearSleepTimer());
    }
  }

  public onNowPlayingClicked(): void {
    /* When the user clicks on the now playing info in the player bar,
    take them to the now-playing component if they're not already
    there. */
    if (this.router.url !== '/now-playing') {
      this.router.navigate(['/now-playing']);
    }
  }

  public onAddToFavoritesClicked(): void {
    this.store.dispatch(addCurrentStationToFavoritesRequested());
  }

  public onRemoveFromFavoritesClicked(): void {
    this.store.dispatch(removeCurrentStationFromFavoritesRequested());
  }

  public decideFavoritesProcessingTooltipText(state: CurrentStationFavoritesProcessingState) {
    switch (state) {
      case CurrentStationFavoritesProcessingState.Loading:
        return 'Loading Favorites';
      case CurrentStationFavoritesProcessingState.Adding:
        return 'Adding Current Station To Favorites';
      case CurrentStationFavoritesProcessingState.Removing:
        return 'Removing Current Station From Favorites';
      default:
        return null;
    }
  }

  public onPlayClicked(): void {
    this.store.dispatch(playAudioStart());
  }

  public onPauseClicked(): void {
    this.store.dispatch(pauseAudioSubmit());
  }
}
