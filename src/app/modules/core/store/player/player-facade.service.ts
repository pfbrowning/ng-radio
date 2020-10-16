import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { RootState } from '../../models/root-state';
import { PlayerSelectors } from './selectors';

@Injectable({ providedIn: 'root' })
export class PlayerFacadeService {
    public playerStatus$ = this.store.pipe(
        select(PlayerSelectors.playerStatus)
    );
    public currentStation$ = this.store.pipe(
        select(PlayerSelectors.currentStation)
    );

    constructor(private store: Store<RootState>) {}
}
