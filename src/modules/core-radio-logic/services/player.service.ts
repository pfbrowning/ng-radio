import { Injectable, Inject } from '@angular/core';
import { Station } from '../models/station';
import { NowPlaying } from '../models/now-playing';
import { StreamInfoService } from './stream-info.service';
import { interval, Subscription, BehaviorSubject } from 'rxjs';
import { Title } from '@angular/platform-browser';
import { ConfigService } from '@modules/config/config.module';
import { NotificationService, Severities } from 'src/app/services/notification.service';
import { SleepTimerService } from './sleep-timer.service';
import { AudioElementToken } from '../injection-tokens/audio-element-token';
import { AudioElement } from '../models/audio-element';
import { LoggingService } from 'src/app/services/logging.service';
import { StreamInfoStatus } from '../models/stream-info-status';
import { isEqual } from 'lodash';
import isBlank from 'is-blank';

@Injectable()
export class PlayerService {
  constructor(private streamInfoService: StreamInfoService,
    private notificationService: NotificationService,
    private sleepTimerService: SleepTimerService,
    private loggingService: LoggingService,
    private configService: ConfigService,
    private titleService: Title,
    @Inject(AudioElementToken) private audio: AudioElement) {
      this.audio.error.subscribe(error => this.onAudioError(error));
      this.audio.playing.subscribe(() => this.onAudioPlaying());
      this.audio.paused.subscribe(() => this.onAudioPaused());
      // Pause the playing audio when the sleep timer does its thing
      this.sleepTimerService.sleep.subscribe(() => this.pause());
      // Whenever the now playing info changes
      this.nowPlaying$.subscribe(nowPlaying => this.onNowPlayingChanged(nowPlaying));
    }

  private _source: string;
  private refreshSub: Subscription;
  private metaFetchSub: Subscription;
  private nowPlaying = new BehaviorSubject<NowPlaying>(new NowPlaying(null, null, StreamInfoStatus.NotInitialized));
  private _paused = new BehaviorSubject<boolean>(true);
  public nowPlaying$ = this.nowPlaying.asObservable();
  public paused = this._paused.asObservable();

  /** Audio source URL */
  public get source(): string {
    return this._source;
  }

  /** The current value of nowPlaying.  Use this only for reference
   * and assignment: don't modify this.  I'll set this to use
   * immutable.js soon. */
  private get nowPlayingValue(): NowPlaying {
    return this.nowPlaying.value;
  }

  /** Notifies the user and logs the event when the audio fails to play */
  private onAudioError(error): void {
    this.loggingService.logException(error, {'event': 'Failed to play audio', 'source': this.source });
    this.notificationService.notify(Severities.Error, 'Failed to play audio', `Failed to play ${this.source}`);
  }

  /** Updates the reactive 'paused' state and triggers change
  detection when the audio starts to play. */
  private onAudioPlaying(): void {
    /* Notify anybody listening to changes on the 'paused'
    state that the audio is no longer paused. */
    this._paused.next(false);
  }

  /** Updates the reactive 'paused' state, and unsubscribes
   * from any metadata fetch & refresh subscriptions. */
  private onAudioPaused(): void {
    /* Clear the src in order to prevent the browser from continuing to
    download audio in the background. */
    this.audio.src = '';
    /* Notify anybody listening to changes on the 'paused'
    state that the audio is now paused. */
    this._paused.next(true);
    /* Unsubscribe from the refresh interval and from any concurrent metadata
    fetch when the media is paused.  We want to do this in the onAudioPaused
    handler so that we catch the "user presses the browser-provided pause button"
    use-case as well, in addition to our own pause button. */
    if (this.refreshSub) { this.refreshSub.unsubscribe(); }
    if (this.metaFetchSub) { this.metaFetchSub.unsubscribe(); }
  }

  private onNowPlayingChanged(nowPlaying: NowPlaying) {
    // If we have stream info
    if (nowPlaying.streamInfo != null) {
      // Notify the user of the currently playing stream info
      const notificationBody = !isBlank(nowPlaying.streamInfo.title) ?
        `${nowPlaying.streamInfo.title} - ${nowPlaying.station.title}` : nowPlaying.station.title;
      this.notificationService.notify(Severities.Info, 'Now Playing', notificationBody);
    }
  }

  /** Reports whether there is a currently selected station */
  public get stationSelected(): boolean {
    return !isBlank(this.source);
  }

  /** Plays the specified Station */
  public playStation(station: Station) {
    // Pause the current audio in case it's already playing something
    this.pause();
    // Update the current station
    this.updateStation(station);
    // Set the source url accordingly in the service
    this._source = station.url;
    // Play the audio and fetch the metadata
    this.play();
  }

  /** Updates the Now Playing metadata with the specified station info */
  private updateStation(station: Station) {
    // If the provided station is any different from the current station
    if (!isEqual(this.nowPlayingValue.station, station)) {
      // Update the NowPlaying metadata with a new object (rather than mutating the existing one)
      this.nowPlaying.next(new NowPlaying(station, null, StreamInfoStatus.NotInitialized));
    }
  }

  /** Initiates a new subscription to getMetadata and updates the stored 'now playing'
   * info accordingly upon succesful metadata retrieval. */
  private loadMetadata(setLoading: boolean = false) {
    // If setLoading is specified and NowPlaying doesn't already indicate loading
    if (setLoading && this.nowPlayingValue.streamInfoStatus !== StreamInfoStatus.Loading) {
      // Emit a new NowPlaying object which indicates that we're currently loading
      this.nowPlaying.next(new NowPlaying(this.nowPlayingValue.station, null, StreamInfoStatus.Loading));
      // Temporarily set a generic app title until we get some stream info back
      this.titleService.setTitle('Browninglogic Radio');
    }
    // If we're not still waiting on a previous metadata fetch to complete
    if (this.metaFetchSub == null || this.metaFetchSub.closed) {
      // Fetch updated stream info from the API
      this.metaFetchSub = this.streamInfoService.getMetadata(this.source)
        .subscribe(
          streamInfo => {
            // If the retrieved stream info differs from that in the current now playing model
            if (!isEqual(this.nowPlayingValue.streamInfo, streamInfo)) {
              // Emit a new NowPlaying object with the updated stream info
              this.nowPlaying.next(new NowPlaying(this.nowPlayingValue.station, streamInfo, StreamInfoStatus.Valid));

              /* Set the HTML document title to the title (or station,
                if no title was provided). */
              if (!isBlank(this.nowPlayingValue.streamInfo.title)) {
                this.titleService.setTitle(this.nowPlayingValue.streamInfo.title);
              } else {
                this.titleService.setTitle(this.nowPlayingValue.station.title);
              }
            }
          },
          error => {
            // Log the error
            this.loggingService.logException(error, {'event': 'Failed to fetch metadata', 'url': this.source });
            // Emit a new NowPlaying object denoting the error
            this.nowPlaying.next(new NowPlaying(this.nowPlayingValue.station, null, StreamInfoStatus.Error));
            // Set a generic app title
            this.titleService.setTitle('Browninglogic Radio');
          }
        );
    }
  }

  public play() {
    /* Since we clear the audio src after pause, we need to assing or re-assign
    it before playing. */
    this.audio.src = this.source;
    // Play the audio
    this.audio.play();
    /* On the initial load of the station, load the metadata
    and set the title to "Loading..." until it gets here. */
    this.loadMetadata(true);
    /* Unsubscribe if there's still an active refresh interval
    subscription from the previously-played station. */
    if (this.refreshSub) { this.refreshSub.unsubscribe(); }
    // Refresh the "Now Playing" metadata once every few seconds.
    this.refreshSub = interval(this.configService.appConfig.metadataRefreshInterval).subscribe(() => this.loadMetadata());
  }

  public pause() {
    this.audio.pause();
  }
}
