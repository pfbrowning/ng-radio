import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { PlayerService } from 'src/app/services/player.service';
import { Subscription } from 'rxjs';
import { NowPlaying } from 'src/app/models/now-playing';
import { Utils } from 'src/app/utils/utils';
import { SleepTimerService } from 'src/app/services/sleep-timer.service';
import { NoSleepService } from 'src/app/services/no-sleep.service';

@Component({
  templateUrl: './now-playing.component.html',
  styleUrls: ['./now-playing.component.scss']
})
export class NowPlayingComponent implements OnInit, OnDestroy {
  constructor(public playerService: PlayerService,
    public sleepTimerService: SleepTimerService,
    public noSleepService: NoSleepService,
    private changeDetectorRef: ChangeDetectorRef) {}

  public nowPlaying: NowPlaying;
  public audioPaused: boolean;
  private nowPlayingSubscription: Subscription;
  private audioPausedSubscription: Subscription;

  ngOnInit() {
    this.nowPlayingSubscription = this.playerService.nowPlaying$.subscribe(nowPlaying => this.nowPlaying = nowPlaying);
    // When the pause state changes
    this.audioPausedSubscription = this.playerService.paused.subscribe(paused => {
      // Bind the new value to the component for template binding
      this.audioPaused = paused;
      // Explicitly trigger change detection because Angular doesn't do it for us on Audio events
      this.changeDetectorRef.detectChanges();
    });
  }

  ngOnDestroy() {
    if (this.nowPlayingSubscription) { this.nowPlayingSubscription.unsubscribe(); }
    if (this.audioPausedSubscription) { this.audioPausedSubscription.unsubscribe(); }
  }

  public onImgError(img: HTMLImageElement, altSrc: string) {
    Utils.SetAltImage(img, altSrc);
  }

  public onTimerSelected(length: number) {
    if (length != null) {
      this.sleepTimerService.setTimer(length);
    } else {
      this.sleepTimerService.cancelTimer();
    }
  }
}
