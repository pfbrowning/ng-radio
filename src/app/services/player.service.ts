import { Injectable } from '@angular/core';

@Injectable({providedIn: 'root'})
export class PlayerService {
  constructor() {}

  private currentAudio: HTMLAudioElement = new Audio();

  public playSource(source: string) {
    // Pause the current audio in case it's already playing something
    this.currentAudio.pause();
    // Assign the new station URL
    this.currentAudio.src = source;
    // Play the audio
    this.currentAudio.play();
  }
}
