import { TestBed } from '@angular/core/testing';

import { ConfigProviderService } from './config-provider.service';

describe('ConfigProviderService', () => {
  let service: ConfigProviderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConfigProviderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
