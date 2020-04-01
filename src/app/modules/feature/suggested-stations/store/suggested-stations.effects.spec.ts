import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';
import { SuggestedStationsEffects } from './suggested-stations.effects';
import { provideMockStore } from '@ngrx/store/testing';
import { initialSuggestedStationsRootState } from '../models/initial-suggested-stations-root-state';
import { StationLookupService } from '@core';
import { createStationLookupServiceSpy } from '@core/testing';
import { NotificationService } from '@notifications';
import { createNotificationServiceSpy } from '@notifications/testing';

describe('SuggestedStationsEffects', () => {
  const actions$: Observable<any> = null;
  let effects: SuggestedStationsEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SuggestedStationsEffects,
        provideMockActions(() => actions$),
        provideMockStore({initialState: initialSuggestedStationsRootState}),
        { provide: StationLookupService, useValue: createStationLookupServiceSpy() },
        { provide: NotificationService, useValue: createNotificationServiceSpy() }
      ]
    });

    effects = TestBed.get<SuggestedStationsEffects>(SuggestedStationsEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
