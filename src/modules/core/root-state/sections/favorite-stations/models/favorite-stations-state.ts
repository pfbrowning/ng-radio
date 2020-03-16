import { Station } from '@core-radio-logic';

export interface FavoriteStationsState {
    favoriteStations: Array<Station>;
    fetchInProgress: boolean;
}