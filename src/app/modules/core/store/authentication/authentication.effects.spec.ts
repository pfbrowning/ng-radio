import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';
import { AuthenticationEffects } from './authentication.effects';
import { CurrentTimeService } from '@core';
import { createCurrentTimeServiceSpy } from '@core/testing';
import { NotificationService, ConfigService, LoggingService } from '@core';
import { createNotificationServiceSpy, createConfigServiceSpy, createLoggingServiceSpy } from '@core/testing';
import { OAuthService } from 'angular-oauth2-oidc';
import { createOAuthServiceSpy } from '../../testing/core-spy-factories.spec';
import { provideMockStore } from '@ngrx/store/testing';
import { initialRootState } from '@core';

describe('AuthenticationEffects', () => {
  const actions$: Observable<any> = null;
  let effects: AuthenticationEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthenticationEffects,
        provideMockActions(() => actions$),
        provideMockStore({initialState: initialRootState}),
        { provide: ConfigService, useValue: createConfigServiceSpy() },
        { provide: CurrentTimeService, useValue: createCurrentTimeServiceSpy() },
        { provide: NotificationService, useValue: createNotificationServiceSpy() },
        { provide: OAuthService, useValue: createOAuthServiceSpy() },
        { provide: LoggingService, useValue: createLoggingServiceSpy() },
      ]
    });

    effects = TestBed.inject<AuthenticationEffects>(AuthenticationEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
