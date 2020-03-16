import { FavoriteStation } from '@core-radio-logic';

export interface FavoriteStationsState {
    favoriteStations: Array<FavoriteStation>;
    fetchInProgress: boolean;
}