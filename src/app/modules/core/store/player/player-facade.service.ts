import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { RootState } from '../../models/root-state';
import { PlayerSelectors } from '.';

@Injectable({ providedIn: 'root' })
export class PlayerFacadeService {
  public metadataForCurrentStation$ = this.store.pipe(select(PlayerSelectors.metadataForCurrentStation));

  constructor(private store: Store<RootState>) {}
}
