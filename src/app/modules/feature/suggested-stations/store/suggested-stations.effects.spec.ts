import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';
import { SuggestedStationsEffects } from './suggested-stations.effects';
import { provideMockStore } from '@ngrx/store/testing';
import { initialSuggestedStationsRootState } from '../models/initial-suggested-stations-root-state';
import { NotificationService, RadioBrowserService } from '@core';
import { SuggestedStationsService } from '../services/suggested-stations.service';
import { createSuggestedStationsServiceSpy } from '../suggested-stations-spy-factories.spec';
import { CoreSpyFactories } from '@core/testing';

describe('SuggestedStationsEffects', () => {
  const actions$: Observable<any> = null;
  let effects: SuggestedStationsEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SuggestedStationsEffects,
        provideMockActions(() => actions$),
        provideMockStore({initialState: initialSuggestedStationsRootState}),
        { provide: SuggestedStationsService, useValue: createSuggestedStationsServiceSpy() },
        { provide: RadioBrowserService, useValue: CoreSpyFactories.createRadioBrowserServiceSpy() },
        { provide: NotificationService, useValue: CoreSpyFactories.createNotificationServiceSpy() }
      ]
    });

    effects = TestBed.inject<SuggestedStationsEffects>(SuggestedStationsEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
