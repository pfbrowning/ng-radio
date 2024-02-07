import { TestBed } from '@angular/core/testing';

import { AccessTokenProviderService } from './access-token-provider.service';

describe('AccessTokenProviderService', () => {
  let service: AccessTokenProviderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AccessTokenProviderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
