import { Station } from '../../player/models/station';

export interface FavoriteStationsState {
    favoriteStations: Array<Station>;
    fetchInProgress: boolean;
    addInProgressUrls: Array<string>;
    removeInProgressIds: Array<number>;
}
