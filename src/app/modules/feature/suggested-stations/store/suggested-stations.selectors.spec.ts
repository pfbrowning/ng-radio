import * as fromSuggestedStations from './suggested-stations.reducer';
import { selectSuggestedStationsState } from './suggested-stations.selectors';

describe('SuggestedStations Selectors', () => {
  it('should select the feature state', () => {
    const result = selectSuggestedStationsState({
      [fromSuggestedStations.suggestedStationsFeatureKey]: {}
    });

    expect(result).toEqual({});
  });
});
