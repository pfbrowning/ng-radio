import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';
import { RadioBrowserEffects } from './radio-browser.effects';
import { provideMockStore } from '@ngrx/store/testing';
import { initialRootState, NotificationService, RadioBrowserService, ConfigService } from '@core';
import { RouterTestingModule } from '@angular/router/testing';
import { CoreSpyFactories, ConfigStubService } from '@core/testing';

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
        { provide: RadioBrowserService, useValue: CoreSpyFactories.createRadioBrowserServiceSpy() },
        { provide: ConfigService, useClass: ConfigStubService },
        { provide: NotificationService, useValue: CoreSpyFactories.createNotificationServiceSpy() },
      ]
    });

    effects = TestBed.inject<RadioBrowserEffects>(RadioBrowserEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
