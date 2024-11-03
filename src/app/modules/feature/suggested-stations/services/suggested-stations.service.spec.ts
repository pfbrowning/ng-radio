import { TestBed } from '@angular/core/testing';
import { SuggestedStationsService } from './suggested-stations.service';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('SuggestedStationsService', () => {
  let service: SuggestedStationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
});
    service = TestBed.inject(SuggestedStationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
