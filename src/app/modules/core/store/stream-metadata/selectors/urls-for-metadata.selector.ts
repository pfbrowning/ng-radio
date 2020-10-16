import { createSelector } from '@ngrx/store';
import { PlayerStatus } from '../../../models/player/player-status';
import { uniq, sortBy } from 'lodash-es';
import { PlayerSelectors } from '../../player/selectors';
import { FavoriteStationsSelectors } from '../../favorite-stations/selectors';
import * as RouterSelectors from '../../router/selectors';
import * as RadioBrowserResultsSelectors from '../../radio-browser-results/selectors';

export const urlsSelectedForMetadata = createSelector(
    PlayerSelectors.currentStation,
    PlayerSelectors.playerStatus,
    RouterSelectors.currentUrl,
    FavoriteStationsSelectors.favoriteStationsArray,
    RadioBrowserResultsSelectors.radioBrowserResults,
    (
        currentStation,
        currentStatus,
        currentRoute,
        favorites,
        radioBrowserResults
    ) => {
        const urls = [];
        if (currentStation != null && currentStatus === PlayerStatus.Playing) {
            urls.push(currentStation.url);
        }
        switch (currentRoute) {
            case '/favorites':
                if (favorites) {
                    urls.push(...favorites.map((s) => s.url));
                }
                break;
            case '/radio-browser':
                if (radioBrowserResults) {
                    urls.push(...radioBrowserResults.map((s) => s.url));
                }
                break;
        }

        /* Ensure that the list is always unique and sorted so that the deep equality
        comparison in our effects really does know if the list actually changed, as opposed
        to just being reordered or having a duplicate entry added. */
        return sortBy(uniq(urls));
    }
);
