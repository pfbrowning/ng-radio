import { SuggestedStationsService } from './services/suggested-stations.service'

export function createSuggestedStationsServiceSpy(): jasmine.SpyObj<
    SuggestedStationsService
> {
    return jasmine.createSpyObj('suggestedStationsService', [
        'getDeveloperSuggestions',
    ])
}
