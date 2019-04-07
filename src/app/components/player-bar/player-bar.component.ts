import { Component, AfterViewChecked, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
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
export class PlayerBarComponent implements AfterViewChecked {
  constructor(public playerService: PlayerService,
    public sleepTimerService: SleepTimerService,
    public noSleepService: NoSleepService,
    private changeDetectorRef: ChangeDetectorRef) {}

  public titleMarquee = false;
  public stationMarquee = false;
  @ViewChild('title') titleElement: ElementRef;
  @ViewChild('station') stationElement: ElementRef;

  ngAfterViewChecked() {
    // If a station is selected and, by extension, the now-playing section exists in the template
    if (this.playerService.stationSelected) {
      /* Check and apply marquee classes if necessary.  This must happen immediately
      after change detection because we won't know whether the content is overflowing
      until it's been bound to the template. */
      this.checkApplyMarquees();
    }
  }

  /** Checks and updates the marquee properties for title and station
   * based on whether the title or content station content is overflowing. */
  private checkApplyMarquees() {
    // Take note of the marquee values before checking for overflow so that we know later if they changed
    const titleMarqueeBefore = this.titleMarquee;
    const stationMarqueeBefore = this.stationMarquee;
    // Set the marquee values based on whether the corresponding element is overflowing
    this.titleMarquee = this.isElementOverflowing(this.titleElement.nativeElement);
    this.stationMarquee = this.isElementOverflowing(this.stationElement.nativeElement);
    /* If either marquee value changed, then initiate another round of change detection
    in order to bind the marquee classes to the template. */
    if (this.titleMarquee !== titleMarqueeBefore || this.stationMarquee !== stationMarqueeBefore) {
      this.changeDetectorRef.detectChanges();
    }
  }

  private isElementOverflowing(element: HTMLElement): boolean {
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
