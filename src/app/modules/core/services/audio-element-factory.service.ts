import { Injectable } from '@angular/core';
import { AudioElement } from '../models/player/audio-element';

@Injectable({providedIn: 'root'})
export class AudioElementFactoryService {
  public create(): AudioElement {
    return new AudioElement(new Audio());
  }
}
