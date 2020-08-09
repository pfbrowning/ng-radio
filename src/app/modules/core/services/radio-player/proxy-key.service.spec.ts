import { TestBed } from '@angular/core/testing';

import { ProxyKeyService } from './proxy-key.service';

describe('ProxyKeyService', () => {
  let service: ProxyKeyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProxyKeyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
