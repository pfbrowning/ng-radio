import { TestBed } from '@angular/core/testing';
import { FavoriteStationsService } from './favorite-stations.service';
import { ConfigService } from '@modules/core/config/config.module';
import { createConfigServiceSpy } from '@modules/core/config/testing/config-spy-factories.spec';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { OAuthService } from 'angular-oauth2-oidc';
import { createOAuthServiceSpy } from '@authentication/testing';

describe('FavoriteStationsService', () => {
  let service: FavoriteStationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        { provide: ConfigService, useValue: createConfigServiceSpy() },
        { provide: OAuthService, useValue: createOAuthServiceSpy() }
      ]
    });
    service = TestBed.inject(FavoriteStationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
