import { FavoriteStationsState } from './favorite-stations-state';

export const initialFavoriteStationsState: FavoriteStationsState = {
    favoriteStations: null,
    fetchInProgress: false,
    fetchFailed: false,
    showEditModal: false,
    editingStationId: null,
    addInProgressUrls: [],
    updateInProgressIds: [],
    removeInProgressIds: []
};
