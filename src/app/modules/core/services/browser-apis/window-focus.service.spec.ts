import { TestBed } from '@angular/core/testing';

import { WindowFocusService } from './window-focus.service';

describe('WindowFocusService', () => {
  let service: WindowFocusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WindowFocusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
