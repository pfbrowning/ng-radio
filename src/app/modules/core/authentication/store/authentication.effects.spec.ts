import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';
import { AuthenticationEffects } from './authentication.effects';
import { ConfigService } from '@config';
import { createConfigServiceSpy } from '@config/testing';
import { CurrentTimeService } from '@core';
import { createCurrentTimeServiceSpy } from '@core/testing';
import { NotificationService } from '@notifications';
import { createNotificationServiceSpy } from '@notifications/testing';
import { OAuthService } from 'angular-oauth2-oidc';
import { createOAuthServiceSpy } from '@authentication/testing';

describe('AuthenticationEffects', () => {
  let actions$: Observable<any>;
  let effects: AuthenticationEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthenticationEffects,
        provideMockActions(() => actions$),
        { provide: ConfigService, useValue: createConfigServiceSpy() },
        { provide: CurrentTimeService, useValue: createCurrentTimeServiceSpy() },
        { provide: NotificationService, useValue: createNotificationServiceSpy() },
        { provide: OAuthService, useValue: createOAuthServiceSpy() },
      ]
    });

    effects = TestBed.get<AuthenticationEffects>(AuthenticationEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
