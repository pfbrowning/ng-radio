import { Station } from '../../../models/player/station';

export interface FavoriteStationsState {
  favoriteStations: Station[];
  fetchInProgress: boolean;
  fetchFailed: boolean;
  showEditModal: boolean;
  editingStationId: number;
  addInProgressUrls: string[];
  updateInProgressIds: number[];
  removeInProgressIds: number[];
}
