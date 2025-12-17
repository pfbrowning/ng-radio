import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { Router } from '@angular/router';
import { PlayerStatus, Station } from '@core/models/player';
import { CurrentStationFavoritesProcessingState } from '@core/models/favorite-stations';
import { PlayerBarFacadeService } from '@core/store';
import { SleepTimerService } from '@core/services';

@Component({
  selector: 'blr-player-bar',
  templateUrl: './player-bar.component.html',
  styleUrls: ['./player-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class PlayerBarComponent {
  constructor(
    private router: Router,
    private playerBarFacade: PlayerBarFacadeService,
    private sleepTimerService: SleepTimerService
  ) {}

  @Input() favoriteMatchingCurrentStation: Station;
  @Input() currentStation: Station;
  @Input() playerStatus: PlayerStatus;
  @Input() favoritesProcessingState: CurrentStationFavoritesProcessingState;
  @Input() metadataForCurrentStation: string;

  public playerStatusEnum = PlayerStatus;

  public minutesToSleep$ = this.sleepTimerService.minutesToSleep$;

  public onNowPlayingClicked(): void {
    /* When the user clicks on the now playing info in the player bar,
    take them to the now-playing component if they're not already
    there. */
    if (this.router.url !== '/now-playing') {
      this.router.navigate(['/now-playing']);
    }
  }

  public onAddToFavoritesClicked(): void {
    this.playerBarFacade.addToFavoritesClicked();
  }

  public onRemoveFromFavoritesClicked(): void {
    this.playerBarFacade.removeFromFavoritesClicked();
  }

  public favoritesProcessingTooltip() {
    switch (this.favoritesProcessingState) {
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
    this.playerBarFacade.playClicked();
  }

  public onPauseClicked(): void {
    this.playerBarFacade.pauseClicked();
  }

  public onTimerSelected(minutes: number): void {
    this.sleepTimerService.setTimer(minutes);
  }

  public onCancelTimerClicked(): void {
    this.sleepTimerService.clearSleepTimer();
  }
}
