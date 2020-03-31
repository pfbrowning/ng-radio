import { radioBrowserReducer } from './radio-browser.reducer';
import { initialRadioBrowserState } from '../models/initial-radio-browser-state';


describe('RadioBrowser Reducer', () => {
  describe('an unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as any;

      const result = radioBrowserReducer(initialRadioBrowserState, action);

      expect(result).toBe(initialRadioBrowserState);
    });
  });
});
