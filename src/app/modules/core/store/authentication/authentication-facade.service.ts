import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { RootState } from '../../models/root-state';
import { AuthenticationSelectors as Selectors, AuthenticationActions as Actions } from '.';
import { filter, map, take } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthenticationFacadeService {
  private stateOnceInitialized$ = this.store.pipe(
    select(Selectors.authenticationState),
    filter(s => s.initialized),
  );

  public email$ = this.stateOnceInitialized$.pipe(map(s => s.email));
  public authenticated$ = this.stateOnceInitialized$.pipe(map(s => s.authenticated));
  public accessToken$ = this.stateOnceInitialized$.pipe(map(s => s.accessToken), take(1));

  public initialized$ = this.store.pipe(select(Selectors.isInitialized));

  constructor(private store: Store<RootState>) { }

  public logoutButtonClicked() {
    this.store.dispatch(Actions.logoutButtonClicked());
  }
}
