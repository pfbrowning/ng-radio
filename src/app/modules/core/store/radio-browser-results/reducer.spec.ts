import { radioBrowserResultsReducer } from './reducer';
import { initialRadioBrowserResultsState } from './models/initial-radio-browser-results-state';

describe('Radio Browser Results Reducer', () => {
  describe('an unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as any;

      const result = radioBrowserResultsReducer(initialRadioBrowserResultsState, action);

      expect(result).toBe(initialRadioBrowserResultsState);
    });
  });
});
