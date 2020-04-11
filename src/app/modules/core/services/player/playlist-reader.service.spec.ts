import { TestBed } from '@angular/core/testing';

import { PlaylistReaderService } from './playlist-reader.service';

describe('PlaylistReaderService', () => {
  let service: PlaylistReaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlaylistReaderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
