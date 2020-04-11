import { TestBed } from '@angular/core/testing';
import { StreamValidatorService } from './stream-validator.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ConfigService } from '../config.service';
import { createConfigServiceSpy } from '../../testing/core-spy-factories.spec';

describe('StreamValidatorService', () => {
  let service: StreamValidatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        { provide: ConfigService, useValue: createConfigServiceSpy() }
      ]
    });
    service = TestBed.inject(StreamValidatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
