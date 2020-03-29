import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';
import { provideMockStore } from '@ngrx/store/testing';
import { initialRootState } from '@root-state';
import { AuthenticationEffects } from './authentication.effects';
import { createOAuthServiceSpy } from '@authentication/testing';
import { OAuthService } from 'angular-oauth2-oidc';
import { ConfigService } from '@config';
import { createConfigServiceSpy } from '@config/testing';
import { CurrentTimeService } from '@core';
import { createCurrentTimeServiceSpy } from '@core/testing';
import { createNotificationServiceSpy } from '@notifications/testing';
import { NotificationService } from '@notifications';

describe('AuthenticationEffects', () => {
  const actions$: Observable<any> = null;
  let effects: AuthenticationEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthenticationEffects,
        provideMockActions(() => actions$),
        provideMockStore({ initialState: initialRootState }),
        { provide: OAuthService, useValue: createOAuthServiceSpy() },
        { provide: ConfigService, useValue: createConfigServiceSpy() },
        { provide: CurrentTimeService, useValue: createCurrentTimeServiceSpy() },
        { provide: NotificationService, useValue: createNotificationServiceSpy() }
      ]
    });

    effects = TestBed.inject<AuthenticationEffects>(AuthenticationEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
