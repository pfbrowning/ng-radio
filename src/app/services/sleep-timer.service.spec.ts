import { TestBed } from '@angular/core/testing';

import { SleepTimerService } from './sleep-timer.service';

describe('SleepTimerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SleepTimerService = TestBed.get(SleepTimerService);
    expect(service).toBeTruthy();
  });
});
