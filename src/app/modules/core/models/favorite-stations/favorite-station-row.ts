import { Station } from '../player/station';

export class FavoriteStationRow {
  constructor(
    public readonly station: Station,
    public readonly deleteInProgress: boolean = false
  ) {}
}
