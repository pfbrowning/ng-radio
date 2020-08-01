import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { RootState } from '../../models/root-state';
import { AuthenticationSelectors as Selectors} from '.';
import { filter, map, take } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthenticationFacadeService {
  private stateOnceInitialized$ = this.store.pipe(
    select(Selectors.authenticationState),
    filter(s => s.initialized),
    take(1)
  );

  public email$ = this.stateOnceInitialized$.pipe(map(s => s.email));
  public authenticated$ = this.stateOnceInitialized$.pipe(map(s => s.authenticated));
  public accessToken$ = this.stateOnceInitialized$.pipe(map(s => s.accessToken));

  public initialized$ = this.store.pipe(select(Selectors.isInitialized));

  constructor(private store: Store<RootState>) { }
}
