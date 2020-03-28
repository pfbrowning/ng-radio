import { favoriteStationsReducer } from './favorite-stations.reducer';
import { initialFavoriteStationsState } from '../models/initial-favorite-stations-state';


describe('FavoriteStations Reducer', () => {
  describe('an unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as any;

      const result = favoriteStationsReducer(initialFavoriteStationsState, action);

      expect(result).toBe(initialFavoriteStationsState);
    });
  });
});
