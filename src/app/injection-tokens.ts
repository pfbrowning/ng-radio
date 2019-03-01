import { InjectionToken } from '@angular/core';
import * as NoSleep from 'nosleep.js';

export const AudioElementToken = new InjectionToken<HTMLAudioElement>('HTMLAudioElement');
export const NoSleepToken = new InjectionToken<NoSleep>('NoSleep.js');
