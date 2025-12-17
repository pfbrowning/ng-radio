import {
  Component,
  Input,
  ViewChild,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Router, NavigationStart, Event } from '@angular/router';
import { WindowService } from '@core/services';
import { SubSink } from 'subsink';

/** Component which abstracts away the logic of showing and hiding an
 * Angular Material sidenav in a responsive manner based on a specified
 * screen size cutoff.
 */
@Component({
    selector: 'blr-responsive-sidenav-container',
    templateUrl: './responsive-sidenav.component.html',
    styleUrls: ['./responsive-sidenav.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class ResponsiveSidenavComponent implements OnInit, OnDestroy {
  /** The minimum screen width that we consider to be a large screen.
   * For example, if you set screenSizeCutoff to 800, then the sidenav
   * will be in smallScreen mode while the screen is 799 pixels wide
   * and smaller.
   */
  @Input() screenSizeCutoff = 800;
  /** Internal ViewChild hook for interacting with the MatSideNav component. */
  @ViewChild('sideNav', { static: true }) sideNav: MatSidenav;
  private subs = new SubSink();

  constructor(
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef,
    private windowService: WindowService
  ) {}

  ngOnInit() {
    // Perform CD on window resize so that we can show / hide the sidenav as necessary
    this.subs.sink = this.windowService.resize.subscribe(() =>
      this.changeDetectorRef.detectChanges()
    );
    this.subs.sink = this.router.events.subscribe(event => this.onRouterEvent(event));
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  private onRouterEvent(routerEvent: Event) {
    /* Hide the sidenav on NavigationStart on small screens because
    it's expected that the user clicked one of the nav links in the
    expanded sidebar menu. */
    if (routerEvent instanceof NavigationStart && this.smallScreen) {
      this.sideNav.close();
      this.changeDetectorRef.detectChanges();
    }
  }

  /** We're in smallScreen mode if the current window width is less than
   * the specified screenSizeCutoff.
   */
  public get smallScreen(): boolean {
    return this.windowService.innerWidth < this.screenSizeCutoff;
  }

  /** Toggle the Angular Material Sidenav */
  public toggle(): void {
    this.sideNav.toggle();
    this.changeDetectorRef.detectChanges();
  }
}
