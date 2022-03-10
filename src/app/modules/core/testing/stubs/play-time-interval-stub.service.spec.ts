import { NEVER, Observable } from 'rxjs';

export class PlayTimeIntervalStubService {
  public playTimeInMinutes$: Observable<number> = NEVER;
}
