import { TestBed } from '@angular/core/testing';
import { FavoriteStationsResolver } from './favorite-stations.resolver';
import { provideMockStore } from '@ngrx/store/testing';
import { initialRootState } from '@core';

describe('FavoriteStationsResolver', () => {
    let resolver: FavoriteStationsResolver;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [provideMockStore({ initialState: initialRootState })],
        });
        resolver = TestBed.inject(FavoriteStationsResolver);
    });

    it('should be created', () => {
        expect(resolver).toBeTruthy();
    });
});
