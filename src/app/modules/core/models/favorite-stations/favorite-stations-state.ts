import { Station } from '../player/station';

export interface FavoriteStationsState {
    favoriteStations: Station[];
    fetchInProgress: boolean;
    fetchFailed: boolean;
    addInProgressUrls: string[];
    removeInProgressIds: number[];
}
