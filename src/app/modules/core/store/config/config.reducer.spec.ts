import { configReducer } from './config.reducer';
import { initialConfigState } from '../../models/config/initial-config-state';

describe('Config Reducer', () => {
  describe('an unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as any;

      const result = configReducer(initialConfigState, action);

      expect(result).toBe(initialConfigState);
    });
  });
});
