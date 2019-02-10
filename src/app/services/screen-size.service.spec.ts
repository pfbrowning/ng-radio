import { TestBed } from '@angular/core/testing';

import { ScreenSizeService } from './screen-size.service';

describe('ScreenSizeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ScreenSizeService = TestBed.get(ScreenSizeService);
    expect(service).toBeTruthy();
  });
});
