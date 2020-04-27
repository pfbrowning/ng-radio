import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';
import { RadioBrowserEffects } from './radio-browser.effects';
import { provideMockStore } from '@ngrx/store/testing';
import { initialRootState, NotificationService, RadioBrowserService, ConfigService } from '@core';
import { createNotificationServiceSpy, createRadioBrowserServiceSpy, createConfigServiceSpy } from '@core/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('RadioBrowserEffects', () => {
  const actions$: Observable<any> = null;
  let effects: RadioBrowserEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      providers: [
        RadioBrowserEffects,
        provideMockActions(() => actions$),
        provideMockStore({initialState: initialRootState}),
        { provide: RadioBrowserService, useValue: createRadioBrowserServiceSpy() },
        { provide: ConfigService, useValue: createConfigServiceSpy() },
        { provide: NotificationService, useValue: createNotificationServiceSpy() },
      ]
    });

    effects = TestBed.inject<RadioBrowserEffects>(RadioBrowserEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
