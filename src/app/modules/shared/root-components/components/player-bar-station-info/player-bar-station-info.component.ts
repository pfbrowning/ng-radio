import { StreamInfoStatus } from '@root-state/player';
import {
  Component,
  ViewChild,
  ElementRef,
  AfterViewChecked,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Store, select } from '@ngrx/store';
import { RootState } from '@root-state';
import { selectStreamInfoStatus } from '@root-state/player';
import { selectStreamInfoTitle, selectCurrentStationTitle } from 'src/app/modules/core/root-state/sections/player/store/player.selectors';



@Component({
  selector: 'blr-player-bar-station-info',
  templateUrl: './player-bar-station-info.component.html',
  styleUrls: ['./player-bar-station-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlayerBarStationInfoComponent implements AfterViewChecked {
  constructor(private store: Store<RootState>, private changeDetectorRef: ChangeDetectorRef) {}

  @ViewChild('title') titleElement: ElementRef;
  @ViewChild('station') stationElement: ElementRef;
  public streamInfoStatus = StreamInfoStatus;
  public titleMarquee = false;
  public stationMarquee = false;
  public streamInfoStatus$ = this.store.pipe(select(selectStreamInfoStatus));
  public streamInfoTitle$ = this.store.pipe(select(selectStreamInfoTitle));
  public currentStationTitle$ = this.store.pipe(select(selectCurrentStationTitle));

  ngAfterViewChecked() {
    /* Check and apply marquee classes immediately after each change detection operation because
    we won't know whether the content is overflowing until it's been bound to the template. */
    this.checkApplyMarquees();
  }

  /** Checks and updates the marquee properties for title and station
   * based on whether the title or station content is overflowing. */
  private checkApplyMarquees() {
    // Take note of the marquee values before checking for overflow so that we know later if they changed
    const titleMarqueeBefore = this.titleMarquee;
    const stationMarqueeBefore = this.stationMarquee;
    // Set the marquee values based on whether the corresponding element is overflowing
    this.titleMarquee = this.isElementOverflowingX(this.titleElement.nativeElement);
    this.stationMarquee = this.isElementOverflowingX(this.stationElement.nativeElement);
    /* If either marquee value changed, then initiate another round of change detection
    in order to bind the marquee classes to the template. */
    if (this.titleMarquee !== titleMarqueeBefore || this.stationMarquee !== stationMarqueeBefore) {
      this.changeDetectorRef.detectChanges();
    }
  }

  private isElementOverflowingX(element: HTMLElement): boolean {
    return element.offsetWidth < element.scrollWidth;
  }
}
