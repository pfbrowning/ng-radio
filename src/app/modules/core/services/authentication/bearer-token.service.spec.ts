import { TestBed } from '@angular/core/testing';
import { BearerTokenService } from './bearer-token.service';
import { provideMockStore } from '@ngrx/store/testing';
import { initialRootState } from '../../models/initial-root-state';
import { ConfigService } from '../config.service';
import { CoreSpyFactories } from '@core/testing';
import { OAuthService } from 'angular-oauth2-oidc';

describe('BearerTokenService', () => {
  let service: BearerTokenService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        BearerTokenService,
        provideMockStore({initialState: initialRootState}),
        { provide: ConfigService, useValue: CoreSpyFactories.createConfigServiceSpy() },
        { provide: OAuthService, useValue: CoreSpyFactories.createOAuthServiceSpy() }
      ]
    });
    service = TestBed.inject(BearerTokenService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
