import { TestBed } from '@angular/core/testing';

import { RadioBrowserService } from './radio-browser.service';

describe('RadioBrowserService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RadioBrowserService = TestBed.get(RadioBrowserService);
    expect(service).toBeTruthy();
  });
});
