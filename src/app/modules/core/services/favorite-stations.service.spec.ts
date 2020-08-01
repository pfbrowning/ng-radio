import { TestBed } from '@angular/core/testing';
import { FavoriteStationsService } from './favorite-stations.service';
import { ConfigService } from '@core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ConfigStubService } from '../testing/stubs/config-stub-service.spec';

describe('FavoriteStationsService', () => {
  let service: FavoriteStationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        { provide: ConfigService, useClass: ConfigStubService }
      ]
    });
    service = TestBed.inject(FavoriteStationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
