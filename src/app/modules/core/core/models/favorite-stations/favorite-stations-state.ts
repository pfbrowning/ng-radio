import { Station } from '../player/station';

export interface FavoriteStationsState {
    favoriteStations: Array<Station>;
    fetchInProgress: boolean;
    fetchFailed: boolean;
    addInProgressUrls: Array<string>;
    removeInProgressIds: Array<number>;
}
