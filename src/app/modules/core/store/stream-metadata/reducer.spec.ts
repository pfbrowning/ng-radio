import { streamMetadataReducer } from './reducer';
import { initialStreamMetadataState } from './models/initial-stream-metadata-state';

describe('Stream Metadata Reducer', () => {
  describe('an unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as any;

      const result = streamMetadataReducer(initialStreamMetadataState, action);

      expect(result).toBe(initialStreamMetadataState);
    });
  });
});
