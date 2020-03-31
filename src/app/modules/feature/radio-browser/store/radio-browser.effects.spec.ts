import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';
import { RadioBrowserEffects } from './radio-browser.effects';
import { provideMockStore } from '@ngrx/store/testing';
import { initialRootState, StationLookupService } from '@core';
import { createStationLookupServiceSpy } from '@core/testing';

describe('RadioBrowserEffects', () => {
  const actions$: Observable<any> = null;
  let effects: RadioBrowserEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        RadioBrowserEffects,
        provideMockActions(() => actions$),
        provideMockStore({initialState: initialRootState}),
        { provide: StationLookupService, useValue: createStationLookupServiceSpy() },
      ]
    });

    effects = TestBed.get<RadioBrowserEffects>(RadioBrowserEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
