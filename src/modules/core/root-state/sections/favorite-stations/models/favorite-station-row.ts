import { Station } from '@core-radio-logic';

export class FavoriteStationRow {
    constructor(
        public readonly station: Station,
        public readonly deleteInProgress: boolean = false
    ) {}
}