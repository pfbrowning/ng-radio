import { NEVER, Observable } from 'rxjs';
import { PlayerStatus } from '../../models/player/player-status';
import { Station } from '../../models/player/station';

export class PlayTimeIntervalStubService {
  public playTimeInMinutes$: Observable<number> = NEVER;
}
