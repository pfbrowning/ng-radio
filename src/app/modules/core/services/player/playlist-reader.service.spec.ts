import { TestBed } from '@angular/core/testing';
import { PlaylistReaderService } from './playlist-reader.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ConfigService } from '../config.service';
import { createConfigServiceSpy } from '../../testing/core-spy-factories.spec';

describe('PlaylistReaderService', () => {
  let service: PlaylistReaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        { provide: ConfigService, useValue: createConfigServiceSpy() }
      ]
    });
    service = TestBed.inject(PlaylistReaderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
