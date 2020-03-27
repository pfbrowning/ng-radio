import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';
import { FavoriteStationsEffects } from './favorite-stations.effects';
import { FavoriteStationsService } from '@core-radio-logic';
import { createFavoriteStationsServiceSpy } from '@core-radio-logic/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { initialRootState } from '@root-state';

describe('FavoriteStationsEffects', () => {
  let actions$: Observable<any>;
  let effects: FavoriteStationsEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        FavoriteStationsEffects,
        { provide: FavoriteStationsService, useValue: createFavoriteStationsServiceSpy() },
        provideMockActions(() => actions$),
        provideMockStore({ initialState: initialRootState })
      ]
    });

    effects = TestBed.get<FavoriteStationsEffects>(FavoriteStationsEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
