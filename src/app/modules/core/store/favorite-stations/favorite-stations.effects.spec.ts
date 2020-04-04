import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';
import { FavoriteStationsEffects } from './favorite-stations.effects';
import { FavoriteStationsService, NotificationService } from '@core';
import { createFavoriteStationsServiceSpy, createNotificationServiceSpy } from '@core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { initialRootState } from '../../models/initial-root-state';

describe('FavoriteStationsEffects', () => {
  const actions$: Observable<any> = null;
  let effects: FavoriteStationsEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        FavoriteStationsEffects,
        provideMockActions(() => actions$),
        provideMockStore({ initialState: initialRootState }),
        { provide: FavoriteStationsService, useValue: createFavoriteStationsServiceSpy() },
        { provide: NotificationService, useValue: createNotificationServiceSpy() }
      ]
    });

    effects = TestBed.inject<FavoriteStationsEffects>(FavoriteStationsEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
