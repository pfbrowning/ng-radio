import { TestBed } from '@angular/core/testing';
import { StreamValidatorService } from './stream-validator.service';

describe('StreamValidatorService', () => {
  let service: StreamValidatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StreamValidatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
