import { Injectable } from '@angular/core';
import { Station } from '../models/station';

@Injectable({providedIn: 'root'})
export class PlayerService {
  constructor() {}

  private currentAudio: HTMLAudioElement = new Audio();
  private currentStation: Station;

  public playStation(station: Station) {
    // Pause the current audio in case it's already playing something
    this.currentAudio.pause();
    // Update the current station
    this.currentStation = station;
    // Assign the new station URL
    this.currentAudio.src = this.currentStation.url;
    // Play the audio
    this.currentAudio.play();
  }
}
