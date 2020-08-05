import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { RootState } from '../../models/root-state';
import * as Selectors from './selectors';

@Injectable({ providedIn: 'root' })
export class StreamMetadataFacadeService {
  public streamsMap$ = this.store.pipe(select(Selectors.streamsMap));

  constructor(private store: Store<RootState>) {}
}
