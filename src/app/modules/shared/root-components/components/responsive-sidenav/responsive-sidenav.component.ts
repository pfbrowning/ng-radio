import { Component, Input, ViewChild, OnInit, OnDestroy, Inject } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Router, Event, NavigationStart } from '@angular/router';
import { Subscription } from 'rxjs';
import { WindowToken } from '@core';

/** Component which abstracts away the logic of showing and hiding an
 * Angular Material sidenav in a responsive manner based on a specified
 * screen size cutoff. */
@Component({
  selector: 'blr-responsive-sidenav-container',
  templateUrl: './responsive-sidenav.component.html',
  styleUrls: ['./responsive-sidenav.component.scss']
})
export class ResponsiveSidenavComponent implements OnInit, OnDestroy {
  /** The minimum screen width that we consider to be a large screen.
   * For example, if you set screenSizeCutoff to 800, then the sidenav
   * will be in smallScreen mode while the screen is 799 pixels wide
   * and smaller. */
  @Input() screenSizeCutoff = 800;
  /** Internal ViewChild hook for interacting with the MatSideNav component. */
  @ViewChild('sideNav', { static: true }) sideNav: MatSidenav;
  private routerEventsSub: Subscription;

  constructor(
    private router: Router,
    @Inject(WindowToken) private window: Window
  ) {}

  ngOnInit() {
    // Pass all router events to onRouterEvent
    this.routerEventsSub = this.router.events.subscribe(event => this.onRouterEvent(event));
  }

  ngOnDestroy() {
    // Unsubscribe from router events to prevent memory leaks
    if (this.routerEventsSub) { this.routerEventsSub.unsubscribe(); }
  }

  private onRouterEvent(routerEvent: Event) {
    /* Hide the sidenav on NavigationStart on small screens because
    it's expected that the user clicked one of the nav links in the
    expanded sidebar menu. */
    if (routerEvent instanceof NavigationStart && this.smallScreen) {
      this.sideNav.close();
    }
  }

  /** We're in smallScreen mode if the current window width is less than
   * the specified screenSizeCutoff. */
  public get smallScreen(): boolean {
    return this.window.innerWidth < this.screenSizeCutoff;
  }

  /** Toggle the Angular Material Sidenav */
  public toggle(): void {
    this.sideNav.toggle();
  }
}
