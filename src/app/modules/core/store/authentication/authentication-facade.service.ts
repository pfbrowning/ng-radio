import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { RootState } from '../../models/root-state';
import { filter, map, distinctUntilChanged } from 'rxjs/operators';
import { AuthenticationService } from '../../services/authentication/authentication.service';
import * as Selectors from './authentication.selectors';
import * as Actions from './authentication.actions';

@Injectable({ providedIn: 'root' })
export class AuthenticationFacadeService {
  private stateOnceInitialized$ = this.store.pipe(
    select(Selectors.authenticationState),
    filter(s => s.initialized),
  );

  public email$ = this.stateOnceInitialized$.pipe(map(s => s.email), distinctUntilChanged());
  public authenticated$ = this.stateOnceInitialized$.pipe(map(s => s.authenticated), distinctUntilChanged());
  public accessToken$ = this.stateOnceInitialized$.pipe(map(s => s.accessToken), distinctUntilChanged());

  public initialized$ = this.store.pipe(select(Selectors.isInitialized));

  constructor(private store: Store<RootState>, private authenticationService: AuthenticationService) { }

  public logoutButtonClicked() {
    this.store.dispatch(Actions.logoutButtonClicked());
  }

  public logInRedirect() {
    /* This operation doesn't really have anything to do with the store, but the fact that that is the
    case is an implementation detail that the rest of the application shouldn't have to care about */
    this.authenticationService.logIn();
  }
}
