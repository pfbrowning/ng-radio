import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { RootState } from '../../models/root-state';
import { AuthenticationSelectors } from '../../store/authentication';
import { filter, map, take } from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class AuthenticationService {
  constructor(private store: Store<RootState>) { }

  public authenticated$ = this.store.pipe(
    select(AuthenticationSelectors.initializationState),
    filter(s => s.initialized),
    take(1),
    map(s => s.authenticated)
  );
}
