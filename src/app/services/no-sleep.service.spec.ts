import { TestBed } from '@angular/core/testing';

import { NoSleepService } from './no-sleep.service';

describe('NoSleepService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NoSleepService = TestBed.get(NoSleepService);
    expect(service).toBeTruthy();
  });
});
