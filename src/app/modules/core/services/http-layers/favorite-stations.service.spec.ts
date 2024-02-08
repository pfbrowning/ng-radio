import { TestBed } from '@angular/core/testing';
import { FavoriteStationsService } from './favorite-stations.service';
import { ConfigProviderService } from '@core/services';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CoreSpyFactories } from '@core/testing';

describe('FavoriteStationsService', () => {
  let service: FavoriteStationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: ConfigProviderService, useValue: CoreSpyFactories.createConfigProviderSpy() },
      ],
    });
    service = TestBed.inject(FavoriteStationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
