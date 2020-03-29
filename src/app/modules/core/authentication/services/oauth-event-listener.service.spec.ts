import { TestBed } from '@angular/core/testing';
import { OauthEventListenerService } from './oauth-event-listener.service';
import { OAuthService } from 'angular-oauth2-oidc';
import { createOAuthServiceSpy } from '@authentication/testing';
import { initialRootState } from '@root-state';
import { provideMockStore } from '@ngrx/store/testing';

describe('OauthEventListenerService', () => {
  let service: OauthEventListenerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        OauthEventListenerService,
        { provide: OAuthService, useValue: createOAuthServiceSpy() },
        provideMockStore({initialState: initialRootState})
      ]
    });
    service = TestBed.inject(OauthEventListenerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
