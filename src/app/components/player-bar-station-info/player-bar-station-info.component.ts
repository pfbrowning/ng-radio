import { Component, ViewChild, ElementRef, AfterViewChecked, ChangeDetectorRef, Input, OnChanges } from '@angular/core';
import { NowPlaying } from 'src/app/models/now-playing';

@Component({
  selector: 'blr-player-bar-station-info',
  templateUrl: './player-bar-station-info.component.html',
  styleUrls: ['./player-bar-station-info.component.scss']
})
export class PlayerBarStationInfoComponent implements AfterViewChecked {
  constructor(private changeDetectorRef: ChangeDetectorRef) {}

  public titleMarquee = false;
  public stationMarquee = false;
  @Input() nowPlaying: NowPlaying;
  @ViewChild('title') titleElement: ElementRef;
  @ViewChild('station') stationElement: ElementRef;

  ngAfterViewChecked() {
    /* Check and apply marquee classes if necessary.  This must happen immediately
    after change detection because we won't know whether the content is overflowing
    until it's been bound to the template. */
    this.checkApplyMarquees();
  }

  /** Checks and updates the marquee properties for title and station
   * based on whether the title or content station content is overflowing. */
  private checkApplyMarquees() {
    if (this.nowPlaying != null) {
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
  }

  private isElementOverflowing(element: HTMLElement): boolean {
    const overflowX = element.offsetWidth < element.scrollWidth,
        overflowY = element.offsetHeight < element.scrollHeight;

    return (overflowX || overflowY);
  }
}
