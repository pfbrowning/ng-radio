import { Injectable } from '@angular/core';
import { Station } from '../models/station';
import { NowPlaying } from '../models/now-playing';

@Injectable({providedIn: 'root'})
export class PlayerService {
  constructor() {}

  private currentAudio: HTMLAudioElement = new Audio();
  public nowPlaying = new NowPlaying();

  public get stationSelected(): boolean {
    return this.currentAudio.src.length > 0;
  }

  public get paused(): boolean {
    return this.currentAudio.paused;
  }

  public playStation(station: Station) {
    // Pause the current audio in case it's already playing something
    this.currentAudio.pause();
    // Update the current station
    this.nowPlaying.updateStation(station);
    // Assign the new station URL
    this.currentAudio.src = station.url;
    // Play the audio
    this.currentAudio.play();
  }

  public play() {
    this.currentAudio.play();
  }

  public pause() {
    this.currentAudio.pause();
  }
}
