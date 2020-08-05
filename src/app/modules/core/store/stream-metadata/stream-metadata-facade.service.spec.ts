import { TestBed } from '@angular/core/testing';
import { StreamMetadataFacadeService } from './stream-metadata-facade.service';

describe('StreamMetadataFacadeService', () => {
  let service: StreamMetadataFacadeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StreamMetadataFacadeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
