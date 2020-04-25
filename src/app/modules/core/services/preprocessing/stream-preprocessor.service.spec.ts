import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ConfigService } from '../config.service';
import { createConfigServiceSpy } from '../../testing/core-spy-factories.spec';
import { StreamPreprocessorService } from './stream-preprocessor.service';

describe('StreamPreprocessorService', () => {
  let service: StreamPreprocessorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        { provide: ConfigService, useValue: createConfigServiceSpy() }
      ]
    });
    service = TestBed.inject(StreamPreprocessorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
