import { TestBed } from '@angular/core/testing';
import { FavoriteStationsService } from './favorite-stations.service';
import { ConfigService } from '@core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { OAuthService } from 'angular-oauth2-oidc';
import { CoreSpyFactories } from '@core/testing';

describe('FavoriteStationsService', () => {
  let service: FavoriteStationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        { provide: ConfigService, useValue: CoreSpyFactories.createConfigServiceSpy() },
        { provide: OAuthService, useValue: CoreSpyFactories.createOAuthServiceSpy() }
      ]
    });
    service = TestBed.inject(FavoriteStationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
