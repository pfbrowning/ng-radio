import { Component, ViewChild, ElementRef, AfterViewChecked, ChangeDetectorRef,
  Input, OnChanges, SimpleChanges, OnInit, OnDestroy } from '@angular/core';
import { NowPlaying } from 'src/app/models/now-playing';
import { StreamInfoStatus } from 'src/app/models/stream-info-status';

@Component({
  selector: 'blr-player-bar-station-info',
  templateUrl: './player-bar-station-info.component.html',
  styleUrls: ['./player-bar-station-info.component.scss']
})
export class PlayerBarStationInfoComponent implements AfterViewChecked, OnChanges, OnInit, OnDestroy {
  constructor(private changeDetectorRef: ChangeDetectorRef) {}

  public streamInfoStatus = StreamInfoStatus;
  public titleMarquee = false;
  public stationMarquee = false;
  private checkMarquee = false;
  @Input() nowPlaying: NowPlaying;
  @ViewChild('title') titleElement: ElementRef;
  @ViewChild('station') stationElement: ElementRef;

  ngOnInit() {
    /* Set checkmarquee on all window resize events because the marquee
    needs to be re-evaluated for each screen size. */
    window.onresize = () => this.checkMarquee = true;
  }

  ngOnDestroy() {
    window.onresize = null;
  }

  ngOnChanges(changes: SimpleChanges) {
    this.checkMarquee = true;
  }

  ngAfterViewChecked() {
    /* Check and apply marquee classes immediately after a change detection operation in
    which either now playing input model or the screen size just changed.  This must
    happen immediately after change detection because we won't know whether the
    content is overflowing until it's been bound to the template. */
    if (this.checkMarquee) {
      this.checkMarquee = false;
      this.checkApplyMarquees();
    }
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
