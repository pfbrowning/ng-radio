import { Station } from '../player/station';

export interface FavoriteStationsState {
    favoriteStations: Station[];
    fetchInProgress: boolean;
    fetchFailed: boolean;
    editingNew: boolean;
    editingStationId: number;
    addInProgressUrls: string[];
    updateInProgressIds: number[];
    removeInProgressIds: number[];
}
