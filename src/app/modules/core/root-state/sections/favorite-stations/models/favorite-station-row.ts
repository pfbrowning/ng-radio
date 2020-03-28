import { Station } from '@core';

export class FavoriteStationRow {
    constructor(
        public readonly station: Station,
        public readonly deleteInProgress: boolean = false
    ) {}
}
