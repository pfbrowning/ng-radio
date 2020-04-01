import { routerExtendedReducer } from './router-extended.reducer';
import { initialRouterExtendedState } from '../../models/router-extended/initial-router-extended-state';


describe('Router Extended Reducer', () => {
  describe('an unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as any;

      const result = routerExtendedReducer(initialRouterExtendedState, action);

      expect(result).toBe(initialRouterExtendedState);
    });
  });
});
