import { Station } from '@core';

export interface FavoriteStationsState {
    favoriteStations: Array<Station>;
    fetchInProgress: boolean;
    addInProgressUrls: Array<string>;
    removeInProgressIds: Array<number>;
}
