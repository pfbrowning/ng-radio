import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { PlayerService } from 'src/app/services/player.service';
import { NowPlaying } from 'src/app/models/now-playing';
import { Subscription, interval, timer } from 'rxjs';
import { SleepTimerService } from 'src/app/services/sleep-timer.service';

@Component({
  selector: 'player-bar',
  templateUrl: './player-bar.component.html',
  styleUrls: ['./player-bar.component.scss']
})
export class PlayerBarComponent implements OnInit, OnDestroy {
  constructor(public playerService: PlayerService,
    public sleepTimerService: SleepTimerService,
    private changeDetectorRef: ChangeDetectorRef) {}

  private nowPlayingSubscription: Subscription;
  private minutesToSleepInterval: Subscription;
  private sleepTimerSet: Subscription;
  private sleepTimerCancelled: Subscription;
  private sleepTimerEmitted: Subscription;
  public nowPlaying: NowPlaying;
  public minutesUntilSleep: number;

  ngOnInit() {
    /* Subscribe to nowPlaying changes and store them in 
    the component for template binding. */
    this.nowPlayingSubscription = this.playerService.nowPlaying$
      .subscribe(nowPlaying => {
        this.nowPlaying = nowPlaying;
        /* Explicitly detect changes after assigning nowPlaying
        so that the 'marquee' class can be properly assigned based
        on whether the nowPlaying data causes an overflow. */
        this.changeDetectorRef.detectChanges();
      });

    if(this.sleepTimerService.sleepTime != null) {
      this.initSleepInterval();
    }

    // Subscribe to the sleep timer events that we care about
    this.sleepTimerSet = this.sleepTimerService.timerSet.subscribe(() => this.initSleepInterval());
    this.sleepTimerCancelled = this.sleepTimerService.timerCancelled.subscribe(() => this.clearSleepInterval());
    this.sleepTimerEmitted = this.sleepTimerService.sleep.subscribe(() => this.clearSleepInterval());
  }

  // Bind minutesUntilSleep and then update it once each minute
  private initSleepInterval(): void {
      this.minutesUntilSleep = this.sleepTimerService.minutesUntilSleep;
      this.minutesToSleepInterval = timer(1000, 60000).subscribe(() => this.minutesUntilSleep = this.sleepTimerService.minutesUntilSleep);
  }

  private clearSleepInterval(): void {
    this.minutesUntilSleep = null;
    this.minutesToSleepInterval.unsubscribe();
  }

  ngOnDestroy() {
    if(this.nowPlayingSubscription) this.nowPlayingSubscription.unsubscribe();
    if(this.minutesToSleepInterval) this.minutesToSleepInterval.unsubscribe();
    if(this.sleepTimerSet) this.sleepTimerSet.unsubscribe();
    if(this.sleepTimerCancelled) this.sleepTimerCancelled.unsubscribe();
    if(this.sleepTimerEmitted) this.sleepTimerEmitted.unsubscribe();
  }

  public isElementOverflowing(element: HTMLElement) : boolean {
    var overflowX = element.offsetWidth < element.scrollWidth,
        overflowY = element.offsetHeight < element.scrollHeight;

    return (overflowX || overflowY);
  }

  public onImgError(img: HTMLImageElement) {
    /* If the image didn't load properly, then use a default
    alternative image in its place.  However, first check to ensure
    that it's not the default image itself that's erroring out. */
    let altImage = '/assets/images/radio.svg';
    if(img.src != altImage) {
      img.src = altImage;
    }
  }
}