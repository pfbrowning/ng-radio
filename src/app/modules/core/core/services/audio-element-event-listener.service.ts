import { Injectable, Inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { AudioElementToken } from '../injection-tokens/audio-element-token';
import { AudioElement } from './audio-element';
import { RootState } from '../models/root-state';
import { audioPaused } from '../store/player/player-actions';

@Injectable()
export class AudioElementEventListenerService {
  constructor(
    private store: Store<RootState>,
    @Inject(AudioElementToken) private audio: AudioElement
  ) {
    this.audio.paused.subscribe(() => this.store.dispatch(audioPaused()));
  }
}
