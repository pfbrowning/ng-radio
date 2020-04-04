import { InjectionToken } from '@angular/core';
import { AudioElement } from '../services/audio-element';

export const AudioElementToken = new InjectionToken<AudioElement>('AudioElement');
