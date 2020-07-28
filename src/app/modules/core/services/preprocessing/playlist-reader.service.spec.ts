import { TestBed } from '@angular/core/testing';
import { PlaylistReaderService } from './playlist-reader.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ConfigService } from '../config.service';
import { ConfigStubService } from '../../testing/stubs/config-stub-service.spec';

describe('PlaylistReaderService', () => {
  let service: PlaylistReaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        { provide: ConfigService, useClass: ConfigStubService }
      ]
    });
    service = TestBed.inject(PlaylistReaderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
