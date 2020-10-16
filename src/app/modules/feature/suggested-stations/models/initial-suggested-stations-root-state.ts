import { SuggestedStationsRootState } from './suggested-stations-root-state';
import { initialRootState } from '@core';
import { initialSuggestedStationsState } from './initial-suggested-stations-state';

export const initialSuggestedStationsRootState: SuggestedStationsRootState = {
    ...initialRootState,
    suggestedStations: initialSuggestedStationsState,
};
