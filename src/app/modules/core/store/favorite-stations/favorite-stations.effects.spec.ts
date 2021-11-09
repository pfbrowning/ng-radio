import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';
import { FavoriteStationsEffects } from './favorite-stations.effects';
import { provideMockStore } from '@ngrx/store/testing';
import { initialRootState } from '../../models/initial-root-state';
import { CoreSpyFactories } from '@core/testing';
import { NotificationsService, FavoriteStationsService } from '@core/services';

describe('FavoriteStationsEffects', () => {
    const actions$: Observable<any> = null;
    let effects: FavoriteStationsEffects;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                FavoriteStationsEffects,
                provideMockActions(() => actions$),
                provideMockStore({ initialState: initialRootState }),
                {
                    provide: FavoriteStationsService,
                    useValue:
                        CoreSpyFactories.createFavoriteStationsServiceSpy(),
                },
                {
                    provide: NotificationsService,
                    useValue: CoreSpyFactories.createNotificationsServiceSpy(),
                },
            ],
        });

        effects = TestBed.inject<FavoriteStationsEffects>(
            FavoriteStationsEffects
        );
    });

    it('should be created', () => {
        expect(effects).toBeTruthy();
    });
});
