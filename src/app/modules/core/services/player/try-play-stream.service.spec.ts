import { TestBed } from '@angular/core/testing';

import { TryPlayStreamService } from './try-play-stream.service';

describe('TryPlayStreamService', () => {
  let service: TryPlayStreamService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TryPlayStreamService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
