import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { PlayerService } from 'src/app/services/player.service';
import { NowPlaying } from 'src/app/models/now-playing';
import { Subscription, interval, timer } from 'rxjs';
import { SleepTimerService } from 'src/app/services/sleep-timer.service';
import { NoSleepService } from 'src/app/services/no-sleep.service';

@Component({
  selector: 'blr-player-bar',
  templateUrl: './player-bar.component.html',
  styleUrls: ['./player-bar.component.scss']
})
export class PlayerBarComponent implements OnInit, OnDestroy {
  constructor(public playerService: PlayerService,
    public sleepTimerService: SleepTimerService,
    public noSleepService: NoSleepService,
    private changeDetectorRef: ChangeDetectorRef) {}

  private nowPlayingSubscription: Subscription;
  public nowPlaying: NowPlaying;

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
  }

  ngOnDestroy() {
    if (this.nowPlayingSubscription) { this.nowPlayingSubscription.unsubscribe(); }
  }

  public isElementOverflowing(element: HTMLElement): boolean {
    const overflowX = element.offsetWidth < element.scrollWidth,
        overflowY = element.offsetHeight < element.scrollHeight;

    return (overflowX || overflowY);
  }

  public onImgError(img: HTMLImageElement) {
    /* If the image didn't load properly, then use a default
    alternative image in its place.  However, first check to ensure
    that it's not the default image itself that's erroring out. */
    const altImage = '/assets/images/radio.svg';
    if (img.src !== altImage) {
      img.src = altImage;
    }
  }

  public onTimerSelected(length: number) {
    if (length != null) {
      this.sleepTimerService.setTimer(length);
    } else {
      this.sleepTimerService.cancelTimer();
    }
  }
}
