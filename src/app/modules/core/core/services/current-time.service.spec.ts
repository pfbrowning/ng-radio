import { TestBed } from '@angular/core/testing';

import { CurrentTimeService } from './current-time.service';

describe('CurrentTimeService', () => {
  let service: CurrentTimeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CurrentTimeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
