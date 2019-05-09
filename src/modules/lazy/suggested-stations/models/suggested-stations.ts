import { Station } from '@modules/core/core-radio-logic/core-radio-logic.module';

export class SuggestedStations {
    constructor(
        public readonly developerSuggested: Array<Station>,
        public readonly topClicked: Array<Station>,
        public readonly topVoted: Array<Station>
    ) {}
}
