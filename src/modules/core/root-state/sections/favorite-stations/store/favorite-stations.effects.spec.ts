import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';
import { FavoriteStationsEffects } from './favorite-stations.effects';
import { FavoriteStationsService } from '@core-radio-logic';
import { createFavoriteStationsServiceSpy } from '@core-radio-logic/testing';

describe('FavoriteStationsEffects', () => {
  let actions$: Observable<any>;
  let effects: FavoriteStationsEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        FavoriteStationsEffects,
        provideMockActions(() => actions$),
        { provide: FavoriteStationsService, useValue: createFavoriteStationsServiceSpy() }
      ]
    });

    effects = TestBed.get<FavoriteStationsEffects>(FavoriteStationsEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
