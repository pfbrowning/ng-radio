import { Component, ChangeDetectionStrategy } from '@angular/core';
import {
    PlayerFacadeService,
    FavoriteStationsFacadeService,
    StreamMetadataFacadeService,
} from '@core/store';

@Component({
    selector: 'blr-app-shell',
    templateUrl: './app-shell.component.html',
    styleUrls: ['./app-shell.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppShellComponent {
    constructor(
        private playerFacade: PlayerFacadeService,
        private favoriteStationsFacade: FavoriteStationsFacadeService,
        private metadataFacade: StreamMetadataFacadeService
    ) {}

    // Player
    public currentStation$ = this.playerFacade.currentStation$;
    public playerStatus$ = this.playerFacade.playerStatus$;

    // Favorite Stations
    public favoriteMatchingCurrentStation$ = this.favoriteStationsFacade
        .favoriteMatchingCurrentStation$;
    public currentStationFavoritesProcessingState$ = this.favoriteStationsFacade
        .currentStationFavoritesProcessingState$;
    public editModalSaveInProgress$ = this.favoriteStationsFacade
        .editModalSaveInProgress$;
    public showEditModal$ = this.favoriteStationsFacade.showEditModal$;
    public existingStationForEdit$ = this.favoriteStationsFacade
        .existingStationForEdit$;
    public favoritesFetchInProgress$ = this.favoriteStationsFacade
        .favoritesFetchInProgress$;
    public metadataForCurrentStation$ = this.metadataFacade
        .metadataForCurrentStation$;
}
