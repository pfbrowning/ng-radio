import { TestBed } from '@angular/core/testing';
import { BearerTokenService } from './bearer-token.service';

describe('BearerTokenService', () => {
  let service: BearerTokenService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BearerTokenService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
