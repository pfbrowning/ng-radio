import { TestBed } from '@angular/core/testing';
import { FavoriteStationsService } from './favorite-stations.service';
import { ConfigProviderService } from '@core/services';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { CoreSpyFactories } from '@core/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('FavoriteStationsService', () => {
  let service: FavoriteStationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [],
    providers: [
        { provide: ConfigProviderService, useValue: CoreSpyFactories.createConfigProviderSpy() },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
    ]
});
    service = TestBed.inject(FavoriteStationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
