import { suggestedStationsReducer } from './suggested-stations.reducer';
import { initialSuggestedStationsState } from '../models/initial-suggested-stations-state';

describe('SuggestedStations Reducer', () => {
  describe('an unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as any;

      const result = suggestedStationsReducer(initialSuggestedStationsState, action);

      expect(result).toBe(initialSuggestedStationsState);
    });
  });
});
