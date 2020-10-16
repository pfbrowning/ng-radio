import { Injectable } from '@angular/core'
import { Store } from '@ngrx/store'
import { RootState } from '@core'
import { FavoriteStationsRouteResolverActions } from '@core/store'
import { FavoriteStationsPageActions } from './actions'

@Injectable({ providedIn: 'root' })
export class FavoriteStationsFeatureFacadeService {
    constructor(private store: Store<RootState>) {}

    public routeResolveInit(): void {
        this.store.dispatch(FavoriteStationsRouteResolverActions.init())
    }

    public deleteFavoriteConfirmed(stationId: number): void {
        this.store.dispatch(
            FavoriteStationsPageActions.deleteFavoriteConfirmed({ stationId })
        )
    }
}
