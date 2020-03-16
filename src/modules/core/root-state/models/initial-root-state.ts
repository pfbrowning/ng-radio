import { RootState } from './root-state';
import { initialFavoriteStationsState } from '../sections/favorite-stations/models/initial-favorite-stations-state';

export const initialRootState: RootState = {
    favoriteStations: initialFavoriteStationsState
}