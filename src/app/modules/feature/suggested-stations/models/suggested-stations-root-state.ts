import { SuggestedStationsState } from './suggested-stations-state';
import { RootState } from '@core';

export interface SuggestedStationsRootState extends RootState {
  suggestedStations: SuggestedStationsState;
}
