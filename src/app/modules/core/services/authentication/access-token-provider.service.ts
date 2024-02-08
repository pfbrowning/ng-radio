import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, filter, map, take } from 'rxjs';
import { AuthenticationSelectors } from '../../store/authentication/selectors';
import { RootState } from '../../models/root-state';

@Injectable({
  providedIn: 'root',
})
export class AccessTokenProviderService {
  private authenticationState$ = this.store.select(AuthenticationSelectors.authenticationState);

  constructor(private store: Store<RootState>) {}

  public getAccessTokenOnceAuthenticated = (): Observable<string> =>
    this.authenticationState$.pipe(
      filter(s => s.initialized && s.authenticated && s.accessToken != null),
      map(s => s.accessToken),
      take(1)
    );
}
