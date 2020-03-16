import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';

import { FavoriteStationsEffects } from './favorite-stations.effects';

describe('FavoriteStationsEffects', () => {
  let actions$: Observable<any>;
  let effects: FavoriteStationsEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        FavoriteStationsEffects,
        provideMockActions(() => actions$)
      ]
    });

    effects = TestBed.get<FavoriteStationsEffects>(FavoriteStationsEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
