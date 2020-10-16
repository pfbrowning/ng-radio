import { TestBed } from '@angular/core/testing';
import { FavoriteStationsFeatureFacadeService } from './favorite-stations-feature-facade.service';
import { provideMockStore } from '@ngrx/store/testing';
import { initialRootState } from '@core';

describe('FavoriteStationsFeatureFacadeService', () => {
    let service: FavoriteStationsFeatureFacadeService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [provideMockStore({ initialState: initialRootState })],
        });
        service = TestBed.inject(FavoriteStationsFeatureFacadeService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
