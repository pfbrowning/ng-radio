import { authenticationReducer } from './authentication.reducer';
import { initialAuthenticationState } from '../../models/authentication/initial-authentication-state';

describe('Authentication Reducer', () => {
  describe('an unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as any;

      const result = authenticationReducer(initialAuthenticationState, action);

      expect(result).toBe(initialAuthenticationState);
    });
  });
});
