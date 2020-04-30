import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { KeepAwakeService, RootState } from '@core';
import { PlayerStatus } from '@core/models/player';
import {
  selectCurrentStationFavoritesProcessingState,
  selectIsProcessingFavoritesForCurrentStation,
  addCurrentStationToFavoritesRequested,
  removeCurrentStationFromFavoritesRequested,
  FavoriteStationsSelectors
} from '@core/store/favorite-stations';
import { selectMinutesUntilSleep } from '@core/store/sleep-timer';
import { CurrentStationFavoritesProcessingState } from '@core/models/favorite-stations';
import { PlayerActions, PlayerSelectors } from '@core/store/player';
import { matProgressButtonDefaults } from '@core/constants';
import { MatProgressButtonOptions } from 'mat-progress-buttons';

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

  public playerStatus = PlayerStatus;
  public processingFavorites$ = this.store.pipe(select(selectIsProcessingFavoritesForCurrentStation));
  public favoritesProcessingState$ = this.store.pipe(select(selectCurrentStationFavoritesProcessingState));
  public playerStatus$ = this.store.pipe(select(PlayerSelectors.selectPlayerStatus));
  public currentStation$ = this.store.pipe(select(FavoriteStationsSelectors.selectCurrentStationOrMatchingFavorite));
  public minutesUntilSleep$ = this.store.pipe(select(selectMinutesUntilSleep));
  public validatingCurrent$ = this.store.pipe(select(PlayerSelectors.selectIsValidationInProgressForCurrentStation));

  private circleButtonDefaults: MatProgressButtonOptions = {
    ...matProgressButtonDefaults,
    fab: true,
    buttonColor: 'accent'
  };
  public playBtnOptions: MatProgressButtonOptions = {
    ...this.circleButtonDefaults,
    icon: {
      fontIcon: 'play_arrow'
    }
  };

  public pauseBtnOptions: MatProgressButtonOptions = {
    ...this.circleButtonDefaults,
    icon: {
      fontIcon: 'pause'
    }
  };

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
    this.store.dispatch(PlayerActions.playAudioStart());
  }

  public onPauseClicked(): void {
    this.store.dispatch(PlayerActions.pauseAudioSubmit());
  }
}
