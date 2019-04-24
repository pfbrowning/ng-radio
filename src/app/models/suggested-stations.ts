import { Station } from 'src/app/models/station';

export class SuggestedStations {
    constructor(
        public readonly developerSuggested: Array<Station>,
        public readonly topClicked: Array<Station>,
        public readonly topVoted: Array<Station>
    ) {}
}
