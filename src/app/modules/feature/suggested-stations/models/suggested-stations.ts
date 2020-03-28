import { Station } from '@core';


export class SuggestedStations {
    constructor(
        public readonly developerSuggested: Array<Station>,
        public readonly topClicked: Array<Station>,
        public readonly topVoted: Array<Station>
    ) {}
}
