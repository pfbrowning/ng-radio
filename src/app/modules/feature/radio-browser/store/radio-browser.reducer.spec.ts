import { radioBrowserSearchReducer } from './radio-browser.reducer';
import { initialRadioBrowserSearchState } from '../models/initial-radio-browser-state';

describe('RadioBrowser Search Reducer', () => {
  describe('an unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as any;

      const result = radioBrowserSearchReducer(initialRadioBrowserSearchState, action);

      expect(result).toBe(initialRadioBrowserSearchState);
    });
  });
});
