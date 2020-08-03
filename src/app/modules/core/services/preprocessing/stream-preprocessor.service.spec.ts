import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ConfigService } from '@core/services';
import { StreamPreprocessorService } from './stream-preprocessor.service';
import { ConfigStubService } from '../../testing/stubs/config-stub-service.spec';

describe('StreamPreprocessorService', () => {
  let service: StreamPreprocessorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        { provide: ConfigService, useClass: ConfigStubService }
      ]
    });
    service = TestBed.inject(StreamPreprocessorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
