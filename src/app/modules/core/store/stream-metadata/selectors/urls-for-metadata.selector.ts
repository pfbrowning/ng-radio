import { createSelector } from '@ngrx/store';
import { PlayerStatus } from '../../../models/player/player-status';
import * as PlayerSelectors from '../../player/player.selectors';
import * as RouterSelectors from '../../router/selectors';

export const urlsSelectedForMetadata = createSelector(
    PlayerSelectors.selectCurrentStation,
    PlayerSelectors.selectPlayerStatus,
    RouterSelectors.currentUrl,
    (currentStation, currentStatus, currentRoute) => {
        /* TODO Conditionally add the urls for favorites or search based on the current
        route url. */
        console.log('current route', currentRoute);
        const initial = currentStation != null && currentStatus == PlayerStatus.Playing
            ? [ currentStation.url ]
            : []
        return initial;
    }
)