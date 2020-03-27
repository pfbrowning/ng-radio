import { playerReducer } from './player.reducer';
import { initialPlayerState } from '../models/initial-player-state';

describe('Player Reducer', () => {
  describe('an unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as any;

      const result = playerReducer(initialPlayerState, action);

      expect(result).toBe(initialPlayerState);
    });
  });
});
