import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { setAltSrc } from '@utilities';
import { PlayerBarStationInfoComponent } from '../player-bar-station-info/player-bar-station-info.component';
import { Store, select } from '@ngrx/store';
import { RootState } from '@root-state';
import {
  addCurrentStationToFavoritesRequested,
  removeCurrentStationFromFavoritesRequested,
  selectIsProcessingFavoritesForCurrentStation,
  selectCurrentStationFavoritesProcessingState,
  selectIsCurrentStationInFavorites,
  CurrentStationFavoritesProcessingState
} from '@root-state/favorite-stations';
import { KeepAwakeService } from '@core';
import { PlayerStatus, selectPlayerStatus, selectCurrentStation, playAudioStart, pauseAudioSubmit } from '@root-state/player';
import { setSleepTimerSubmit, clearSleepTimer, selectMinutesUntilSleep } from '@root-state/sleep-timer';

@Component({
  selector: 'blr-player-bar',
  templateUrl: './player-bar.component.html',
  styleUrls: ['./player-bar.component.scss']
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
  public minutesUntilSleep$ = this.store.pipe(select(selectMinutesUntilSleep))

  public onImgError(img: HTMLImageElement) {
    setAltSrc(img, '/assets/images/radio.svg');
  }

  public onTimerSelected(minutes: number) {
    if (minutes != null) {
      this.store.dispatch(setSleepTimerSubmit({minutes}))
    } else {
      this.store.dispatch(clearSleepTimer());
    }
  }

  public onNowPlayingClicked(): void {
    /* When the user clicks on the now playing info in the player bar,
    take them to the now-playing component if they're not already
    there. */
    if (this.router.url !== '/now-playing') {
      console.log('navigating');
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
