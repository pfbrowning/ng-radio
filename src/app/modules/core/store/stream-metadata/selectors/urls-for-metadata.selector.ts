import { createSelector } from '@ngrx/store';
import { PlayerStatus } from '../../../models/player/player-status';
import * as PlayerSelectors from '../../player/player.selectors';
import * as RouterSelectors from '../../router/selectors';
import * as FavoritesSelectors from '../../favorite-stations/favorite-stations.selectors';

export const urlsSelectedForMetadata = createSelector(
    PlayerSelectors.selectCurrentStation,
    PlayerSelectors.selectPlayerStatus,
    RouterSelectors.currentUrl,
    FavoritesSelectors.selectFavoriteStations,
    (currentStation, currentStatus, currentRoute, favorites) => {
        /* TODO Conditionally add the urls for favorites or search based on the current
        route url. */
        console.log('current route', currentRoute);
        const urls = [];
        if (currentStation != null && currentStatus == PlayerStatus.Playing) {
            urls.push(currentStation.url);
        }
        switch(currentRoute) {
            case '/favorites':
                if (favorites) {
                    urls.push(...favorites.map(s => s.url));
                }
                break;
        }
        return urls;
    }
)