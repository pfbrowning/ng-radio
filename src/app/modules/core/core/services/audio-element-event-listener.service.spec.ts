import { TestBed } from '@angular/core/testing';
import { AudioElementEventListenerService } from './audio-element-event-listener.service';
import { provideMockStore } from '@ngrx/store/testing';
import { initialRootState } from '../../root-state/models/initial-root-state';
import { AudioElementToken } from '../injection-tokens/audio-element-token';
import { AudioElementStub } from '../testing/AudioElementStub.spec';

describe('AudioElementEventListenerService', () => {
  let service: AudioElementEventListenerService;
  let audioElement: AudioElementStub;

  beforeEach(() => {
    audioElement = new AudioElementStub();

    TestBed.configureTestingModule({
      providers: [
        AudioElementEventListenerService,
        provideMockStore({initialState: initialRootState}),
        { provide: AudioElementToken, useValue: audioElement },
      ]
    });
    service = TestBed.inject(AudioElementEventListenerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
