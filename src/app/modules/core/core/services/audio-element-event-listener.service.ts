import { Injectable, Inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { RootState } from '../../root-state/models/root-state';
import { AudioElement } from '../models/audio-element';
import { AudioElementToken } from '../injection-tokens/audio-element-token';
import { audioPaused } from '@root-state/player';

@Injectable()
export class AudioElementEventListenerService {
  constructor(
    private store: Store<RootState>,
    @Inject(AudioElementToken) private audio: AudioElement
  ) {
    this.audio.paused.subscribe(() => this.store.dispatch(audioPaused()));
  }
}
