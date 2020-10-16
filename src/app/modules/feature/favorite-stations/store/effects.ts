import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map } from 'rxjs/operators';
import { FavoriteStationsPageActions } from './actions';
import { FavoriteStationsActions } from '@core/store';

@Injectable()
export class FavoriteStationsFeatureEffects {
    deleteStationOnConfirmed$ = createEffect(() =>
        this.actions$.pipe(
            ofType(FavoriteStationsPageActions.deleteFavoriteConfirmed),
            map(({ stationId }) =>
                FavoriteStationsActions.removeFromFavoritesStart({ stationId })
            )
        )
    );

    constructor(private actions$: Actions) {}
}
