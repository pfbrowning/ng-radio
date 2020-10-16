import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';
import { RootState } from '@core';
import { PlayerStatus } from '@core/models/player';
import { FavoriteStationsActions } from '@core/store';
import { StreamMetadataFacadeService, PlayerFacadeService } from '@core/store';
import { SleepTimerService } from '@core/services';

@Component({
    templateUrl: './now-playing.component.html',
    styleUrls: ['./now-playing.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NowPlayingComponent {
    constructor(
        private sleepTimerService: SleepTimerService,
        private store: Store<RootState>,
        private metadataFacade: StreamMetadataFacadeService,
        private playerFacade: PlayerFacadeService
    ) {}

    public playerStatus$ = this.playerFacade.playerStatus$;
    public currentStation$ = this.playerFacade.currentStation$;
    public currentStreamInfo$ = this.metadataFacade.metadataForCurrentStation$;
    public minutesUntilSleep$ = this.sleepTimerService.minutesToSleep$;
    public playerStatus = PlayerStatus;

    public onEditFavoriteClicked(): void {
        this.store.dispatch(FavoriteStationsActions.openStationEditCurrent());
    }
}
