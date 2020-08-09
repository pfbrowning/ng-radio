import { TestBed } from '@angular/core/testing';

import { RadioPlayerService } from './radio-player.service';

describe('RadioPlayerService', () => {
  let service: RadioPlayerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RadioPlayerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
