import { InjectionToken } from '@angular/core';
import { AudioElement } from '../models/player/audio-element';

export const AudioElementToken = new InjectionToken<AudioElement>('AudioElement');
