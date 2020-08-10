import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { RootState } from '../../models/root-state';
import * as Selectors from './selectors';

@Injectable({ providedIn: 'root' })
export class SocketIoFacadeService {
  public authenticated$ = this.store.pipe(select(Selectors.authenticated));
  public connected$ = this.store.pipe(select(Selectors.connected));

  constructor(private store: Store<RootState>) {}
}
