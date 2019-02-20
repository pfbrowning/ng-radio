import { Injectable } from '@angular/core';
import { Station } from '../models/station';
import { NowPlaying } from '../models/now-playing';
import { MetadataService } from './metadata.service';
import { interval, Subscription, BehaviorSubject } from 'rxjs';
import { Title } from '@angular/platform-browser';
import { ConfigService } from './config.service';
import { NotificationService, Severities } from './notification.service';
import { Metadata } from '../models/metadata';
import { cloneDeep, isEqual } from 'lodash';
import isBlank from 'is-blank';

@Injectable({providedIn: 'root'})
export class PlayerService {
  constructor(private metadataService: MetadataService,
    private notificationService: NotificationService,
    private configService: ConfigService,
    private titleService: Title) {
      // Handle audio errors
      this.currentAudio.onerror = (error) => this.onAudioError(error);
      this.currentAudio.onpause = (event) => this.onPause(event);
    }

  private currentAudio: HTMLAudioElement = new Audio();
  private refreshSub: Subscription;
  private metaFetchSub: Subscription;
  private nowPlaying = new NowPlaying();
  public nowPlaying$ = new BehaviorSubject<NowPlaying>(this.nowPlaying);

  public get stationSelected(): boolean {
    return this.currentAudio.src.length > 0;
  }

  public get paused(): boolean {
    return this.currentAudio.paused;
  }

  private onAudioError(error) : void {
    this.notificationService.notify(Severities.Error, 'Failed to play audio', `Failed to play ${this.currentAudio.src}`);
  }

  private onPause(event): void {
    console.log('pause', event);
    this.notificationService.notify(Severities.Info, 'Pause', 'Pause Event');
  }

  public playStation(station: Station) {
    // Pause the current audio in case it's already playing something
    this.currentAudio.pause();
    // Update the current station
    this.updateStation(station);
    // Assign the new station URL
    this.currentAudio.src = station.url;
    // Play the audio and fetch the metadata
    this.play();
  }

  private updateStation(station: Station) {
    this.nowPlaying.station = station.title;
    this.nowPlaying.genre = station.genre;
    this.nowPlaying.iconUrl = station.iconUrl;
    // Notify listeners of the station change
    this.nowPlaying$.next(this.nowPlaying);
  }

  private loadMetadata(setLoadingTitle: boolean = false) {
    if(setLoadingTitle) {
      this.nowPlaying.title = 'Loading Metadata...';
      this.nowPlaying$.next(this.nowPlaying);
    }
    // If we're not still waiting on a previous metadata fetch to complete
    if(this.metaFetchSub == null || this.metaFetchSub.closed) {
      // Fetch updated metadata from the API
      this.metaFetchSub = this.metadataService.getMetadata(this.currentAudio.src)
        .subscribe(
          meta => {
            // Update the "Now Playing" model with the retrieved metadata
            this.updateMetadata(meta);
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
            "Metadata Unavilable" */
            this.nowPlaying.title = 'Metadata Unavailable';
            this.titleService.setTitle(this.nowPlaying.title);
            this.nowPlaying$.next(this.nowPlaying);
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

  public updateMetadata(metadata: Metadata) {
    let beforeChange = cloneDeep(this.nowPlaying);
    this.nowPlaying.title = metadata.title;
    this.nowPlaying.bitrate = metadata.bitrate;
    /* If we don't already have a stored station title and one
    was provided in the metadata, then use the metadata version. */
    if(this.nowPlaying.station == null && metadata.stationTitle != null) {
        this.nowPlaying.station = metadata.stationTitle;
    }
    /* Similarly, assign genre if it was returned in
    the metadata and doesn't already exist. */
    if(this.nowPlaying.genre == null && metadata.genre != null) {
        this.nowPlaying.genre = metadata.genre;
    }
    /* If anything changed, then notify listeners. */
    if(!isEqual(beforeChange, this.nowPlaying)) {
      this.nowPlaying$.next(this.nowPlaying);
    }
  }
}