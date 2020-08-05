import { TestBed } from '@angular/core/testing';
import { StreamMetadataService } from './stream-metadata.service';

describe('StreamMetadataService', () => {
  let service: StreamMetadataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StreamMetadataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
