import { Component, ChangeDetectionStrategy } from '@angular/core'
import { Store } from '@ngrx/store'
import { RootState } from '@core'
import { ConfirmationService } from 'primeng/api'
import { FavoriteStationsActions } from '@core/store'
import { Station } from '@core/models/player'
import {
    PlayerActions,
    StreamMetadataFacadeService,
    FavoriteStationsFacadeService,
} from '@core/store'
import { FavoriteStationsFeatureFacadeService } from '../../store/favorite-stations-feature-facade.service'

@Component({
    selector: 'blr-favorite-stations',
    templateUrl: './favorite-stations.component.html',
    styleUrls: ['./favorite-stations.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FavoriteStationsComponent {
    constructor(
        private store: Store<RootState>,
        private confirmationService: ConfirmationService,
        private streamMetadataFacade: StreamMetadataFacadeService,
        private favoriteStationsFacade: FavoriteStationsFacadeService,
        private favoriteStationsFeatureFacade: FavoriteStationsFeatureFacadeService
    ) {}

    public columns = ['name', 'now-playing', 'actions']

    public stationRows$ = this.favoriteStationsFacade.favoriteStationRows$
    public metadata$ = this.streamMetadataFacade.streamsMap$

    public onRowClicked(station: Station): void {
        this.store.dispatch(PlayerActions.selectStation({ station }))
    }

    public onDeleteClicked(station: Station, event): void {
        // Don't propagate up to row click
        event.stopPropagation()
        this.confirmationService.confirm({
            message: `Are you sure you want to delete ${station.title}?`,
            accept: () =>
                this.favoriteStationsFeatureFacade.deleteFavoriteConfirmed(
                    station.stationId
                ),
        })
    }

    public onEditClicked(station: Station, event): void {
        // Don't propagate up to row click
        event.stopPropagation()
        this.store.dispatch(
            FavoriteStationsActions.openStationEditExisting({
                stationId: station.stationId,
            })
        )
    }
}
