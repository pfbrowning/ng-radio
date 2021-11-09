import { SuggestedStationsService } from './services/suggested-stations.service';

export const createSuggestedStationsServiceSpy = () =>
  jasmine.createSpyObj<SuggestedStationsService>('suggestedStationsService', [
    'fetchDeveloperSuggestions',
  ]);
