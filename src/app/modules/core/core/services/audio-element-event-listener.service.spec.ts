import { TestBed } from '@angular/core/testing';
import { AudioElementEventListenerService } from './audio-element-event-listener.service';

describe('AudioElementEventListenerService', () => {
  let service: AudioElementEventListenerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AudioElementEventListenerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
