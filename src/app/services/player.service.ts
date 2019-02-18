import { Injectable } from '@angular/core';
import { Station } from '../models/station';
import { NowPlaying } from '../models/now-playing';
import { MetadataService } from './metadata.service';
import { interval, Subscription } from 'rxjs';
import { Title } from '@angular/platform-browser';
import isBlank from 'is-blank';
import { ConfigService } from './config.service';
import { ErrorHandlingService } from './error-handling.service';
import { NotificationService, Severities } from './notification.service';

@Injectable({providedIn: 'root'})
export class PlayerService {
  constructor(private metadataService: MetadataService,
    private notificationService: NotificationService,
    private configService: ConfigService,
    private titleService: Title) {
      // Handle audio errors
      this.currentAudio.onerror = (error) => this.onAudioError(error);
    }

  private currentAudio: HTMLAudioElement = new Audio();
  public nowPlaying = new NowPlaying();
  private refreshSub: Subscription;
  private metaFetchSub: Subscription

  public get stationSelected(): boolean {
    return this.currentAudio.src.length > 0;
  }

  public get paused(): boolean {
    return this.currentAudio.paused;
  }

  private onAudioError(error) : void {
    this.notificationService.notify(Severities.Error, 'Failed to play audio', `Failed to play ${this.currentAudio.src}`);
  }

  public playStation(station: Station) {
    // Pause the current audio in case it's already playing something
    this.currentAudio.pause();
    // Update the current station
    this.nowPlaying.updateStation(station);
    // Assign the new station URL
    this.currentAudio.src = station.url;
    // Play the audio and fetch the metadata
    this.play();
  }

  private loadMetadata(setLoadingTitle: boolean = false) {
    if(setLoadingTitle) {
      this.nowPlaying.title = 'Loading Metadata...';
    }
    // If we're not still waiting on a previous metadata fetch to complete
    if(this.metaFetchSub == null || this.metaFetchSub.closed) {
      // Fetch updated metadata from the API
      this.metaFetchSub = this.metadataService.getMetadata(this.currentAudio.src)
        .subscribe(
          meta => {
            // Update the "Now Playing" model with the retrieved metadata
            this.nowPlaying.updateMetadata(meta);
            // If a title was provided, then assign it as the HTML title
            if(!isBlank(this.nowPlaying.title)) {
              this.titleService.setTitle(this.nowPlaying.title);
            }
            // If no title was provided, then just use "Browninglogic Radio"
            else {
              this.titleService.setTitle('Browninglogic Radio');
            }
          },
          error => {
            /* In the case of error, gracefully set the title to 
            "Metadata Unavilable" and log to console */
            this.nowPlaying.title = 'Metadata Unavailable';
            this.titleService.setTitle(this.nowPlaying.title);
            console.error('Error fetching metadata', error);
          }
        );
    }
  }

  public play() {
    // Play the audio
    this.currentAudio.play();
    /* On the initial load of the station, load the metadata 
    and set the title to "Loading..." until it gets here. */
    this.loadMetadata(true);
    /* Unsubscribe if there's still an active refresh interval 
    subscription from the previously-played station. */
    if(this.refreshSub) this.refreshSub.unsubscribe();
    // Refresh the "Now Playing" metadata once every few seconds.
    this.refreshSub = interval(this.configService.appConfig.metadataRefreshInterval).subscribe(() => this.loadMetadata());
  }

  public pause() {
    this.currentAudio.pause();
    if(this.refreshSub) this.refreshSub.unsubscribe();
    if(this.metaFetchSub) this.metaFetchSub.unsubscribe();
  }
}
