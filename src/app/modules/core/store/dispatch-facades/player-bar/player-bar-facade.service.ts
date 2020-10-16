import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { RootState } from '../../../models/root-state';
import * as PlayerBarActions from './player-bar.actions';

@Injectable({ providedIn: 'root' })
export class PlayerBarFacadeService {
    constructor(private store: Store<RootState>) {}

    public addToFavoritesClicked(): void {
        this.store.dispatch(PlayerBarActions.addToFavoritesClicked());
    }

    public removeFromFavoritesClicked(): void {
        this.store.dispatch(PlayerBarActions.removeFromFavoritesClicked());
    }

    public playClicked(): void {
        this.store.dispatch(PlayerBarActions.playClicked());
    }

    public pauseClicked(): void {
        this.store.dispatch(PlayerBarActions.pauseClicked());
    }
}
