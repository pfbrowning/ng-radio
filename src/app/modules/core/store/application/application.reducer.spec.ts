import { applicationReducer } from './application.reducer';
import { initialApplicationState } from '../../models/application/initial-application-state';

describe('Application Reducer Reducer', () => {
  describe('an unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as any;

      const result = applicationReducer(initialApplicationState, action);

      expect(result).toBe(initialApplicationState);
    });
  });
});
