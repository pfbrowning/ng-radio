import { createSelector } from '@ngrx/store';
import * as PlayerSelectors from '../../player/player.selectors';
import { PlayerStatus } from '../../../models/player/player-status';

export const urlsSelectedForMetadata = createSelector(
    PlayerSelectors.selectCurrentStation,
    PlayerSelectors.selectPlayerStatus,
    (currentStation, currentStatus) => {
        /* TODO Conditionally add the urls for favorites or search based on the current
        route url. */
        const initial = currentStation != null && currentStatus == PlayerStatus.Playing
            ? [ currentStation.url ]
            : []
        return initial;
    }
)