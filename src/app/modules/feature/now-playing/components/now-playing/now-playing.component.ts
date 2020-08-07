import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { RootState } from '@core';
import { KeepAwakeService } from '@core';
import { PlayerStatus } from '@core/models/player';
import { FavoriteStationsSelectors, FavoriteStationsActions } from '@core/store/favorite-stations';
import { PlayerSelectors, PlayerFacadeService, StreamMetadataFacadeService } from '@core/store';
import { SleepTimerService } from '@core/services';

@Component({
  templateUrl: './now-playing.component.html',
  styleUrls: ['./now-playing.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NowPlayingComponent {
  constructor(
    public keepAwakeService: KeepAwakeService,
    private sleepTimerService: SleepTimerService,
    private store: Store<RootState>,
    private playerFacadeService: PlayerFacadeService,
    private metadataFacade: StreamMetadataFacadeService
  ) {}

  public playerStatus$ = this.store.pipe(select(PlayerSelectors.selectPlayerStatus));
  public currentStation$ = this.store.pipe(select(FavoriteStationsSelectors.selectCurrentStationOrMatchingFavorite));
  public currentStreamInfo$ = this.metadataFacade.metadataForCurrentStation$;
  public minutesUntilSleep$ = this.sleepTimerService.minutesToSleep$;
  public validatingCurrent$ = this.store.pipe(select(PlayerSelectors.selectIsValidationInProgressForCurrentStation));
  public playerStatus = PlayerStatus;

  public onEditFavoriteClicked(): void {
    this.store.dispatch(FavoriteStationsActions.openStationEditCurrent());
  }
}
