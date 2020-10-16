import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { FavoriteStationsActions } from './actions';
import { RouteResolverActions } from './actions';
import * as PlayerBarActions from '../dispatch-facades/player-bar/player-bar.actions';
import {
    switchMap,
    catchError,
    map,
    withLatestFrom,
    filter,
    mergeMap,
    tap,
} from 'rxjs/operators';
import { of } from 'rxjs';
import { selectStation } from '../player/player-actions';
import { FavoriteStationsService, NotificationsService } from '@core/services';
import { PlayerFacadeService } from '../player/player-facade.service';
import { FavoriteStationsFacadeService } from './favorite-stations-facade.service';

@Injectable()
export class FavoriteStationsEffects {
    constructor(
        private actions$: Actions,
        private playerFacade: PlayerFacadeService,
        private favoriteStationsService: FavoriteStationsService,
        private favoriteStationsFacade: FavoriteStationsFacadeService,
        private notificationsService: NotificationsService
    ) {}

    fetchStationsSubmit$ = createEffect(() =>
        this.actions$.pipe(
            ofType(
                FavoriteStationsActions.fetchStationsSubmit,
                RouteResolverActions.init
            ),
            withLatestFrom(
                this.favoriteStationsFacade.favoriteStationsArray$,
                this.favoriteStationsFacade.favoritesFetchInProgress$
            ),
            filter(([, stations, fetching]) => !stations && !fetching),
            map(() => FavoriteStationsActions.fetchStationsStart())
        )
    );

    fetchOnInitialStationSelect$ = createEffect(() =>
        this.actions$.pipe(
            ofType(selectStation),
            map(() => FavoriteStationsActions.fetchStationsSubmit())
        )
    );

    fetchStations$ = createEffect(() =>
        this.actions$.pipe(
            ofType(FavoriteStationsActions.fetchStationsStart),
            switchMap(() =>
                this.favoriteStationsService.fetchAll().pipe(
                    map(stations =>
                        FavoriteStationsActions.fetchStationsSucceeded({
                            stations,
                        })
                    ),
                    catchError(error =>
                        of(
                            FavoriteStationsActions.fetchStationsFailed({
                                error,
                            })
                        )
                    )
                )
            )
        )
    );

    addCurrentStationToFavoritesRequested$ = createEffect(() =>
        this.actions$.pipe(
            ofType(PlayerBarActions.addToFavoritesClicked),
            withLatestFrom(this.playerFacade.currentStation$),
            map(([, station]) =>
                FavoriteStationsActions.addToFavoritesStart({ station })
            )
        )
    );

    addFavorite$ = createEffect(() =>
        this.actions$.pipe(
            ofType(FavoriteStationsActions.addToFavoritesStart),
            mergeMap(action =>
                this.favoriteStationsService.addFavorite(action.station).pipe(
                    map(station =>
                        FavoriteStationsActions.addToFavoritesSucceeded({
                            station,
                        })
                    ),
                    catchError(error =>
                        of(
                            FavoriteStationsActions.addToFavoritesFailed({
                                station: action.station,
                                error,
                            })
                        )
                    )
                )
            )
        )
    );

    updateFavorite$ = createEffect(() =>
        this.actions$.pipe(
            ofType(FavoriteStationsActions.stationUpdateStart),
            mergeMap(({ station }) =>
                this.favoriteStationsService
                    .updateFavorite(station.stationId, station)
                    .pipe(
                        map(updated =>
                            FavoriteStationsActions.stationUpdateSucceeded({
                                updated,
                            })
                        ),
                        catchError(error =>
                            of(
                                FavoriteStationsActions.stationUpdateFailed({
                                    station,
                                    error,
                                })
                            )
                        )
                    )
            )
        )
    );

    removeCurrentStationFromFavoritesRequested$ = createEffect(() =>
        this.actions$.pipe(
            ofType(PlayerBarActions.removeFromFavoritesClicked),
            withLatestFrom(
                this.favoriteStationsFacade.favoriteMatchingCurrentStation$
            ),
            map(([, station]) =>
                FavoriteStationsActions.removeFromFavoritesStart({
                    stationId: station.stationId,
                })
            )
        )
    );

    removeFavorite$ = createEffect(() =>
        this.actions$.pipe(
            ofType(FavoriteStationsActions.removeFromFavoritesStart),
            mergeMap(action =>
                this.favoriteStationsService
                    .removeFavorite(action.stationId)
                    .pipe(
                        map(() =>
                            FavoriteStationsActions.removeFromFavoritesSucceeded(
                                { stationId: action.stationId }
                            )
                        ),
                        catchError(error =>
                            of(
                                FavoriteStationsActions.removeFromFavoritesFailed(
                                    { stationId: action.stationId, error }
                                )
                            )
                        )
                    )
            )
        )
    );

    openStationEditCurrent$ = createEffect(() =>
        this.actions$.pipe(
            ofType(FavoriteStationsActions.openStationEditCurrent),
            withLatestFrom(
                this.favoriteStationsFacade.favoriteMatchingCurrentStation$
            ),
            map(([, station]) =>
                FavoriteStationsActions.openStationEditExisting({
                    stationId: station.stationId,
                })
            )
        )
    );

    notifyAddSucceeded$ = createEffect(
        () =>
            this.actions$.pipe(
                ofType(FavoriteStationsActions.addToFavoritesSucceeded),
                tap(action =>
                    this.notificationsService.success(
                        'Added To Favorites',
                        `${action.station.title} has been added to favorites.`
                    )
                )
            ),
        { dispatch: false }
    );

    notifyAddFailed$ = createEffect(
        () =>
            this.actions$.pipe(
                ofType(FavoriteStationsActions.addToFavoritesFailed),
                tap(action =>
                    this.notificationsService.error(
                        'Failed to Add To Favorites',
                        `${action.station.title} was not added to favorites.`
                    )
                )
            ),
        { dispatch: false }
    );

    notifyRemoveFailed$ = createEffect(
        () =>
            this.actions$.pipe(
                ofType(FavoriteStationsActions.removeFromFavoritesFailed),
                tap(() =>
                    this.notificationsService.error(
                        'Failed to Remove From Favorites',
                        `Station was not removed from favorites.`
                    )
                )
            ),
        { dispatch: false }
    );
}
