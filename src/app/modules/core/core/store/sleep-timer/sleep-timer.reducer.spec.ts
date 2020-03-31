import { sleepTimerReducer } from './sleep-timer.reducer';
import { initialSleepTimerState } from '../../models/sleep-timer/initial-sleep-timer-state';

describe('Sleep Timer Reducer', () => {
  describe('an unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as any;

      const result = sleepTimerReducer(initialSleepTimerState, action);

      expect(result).toBe(initialSleepTimerState);
    });
  });
});
