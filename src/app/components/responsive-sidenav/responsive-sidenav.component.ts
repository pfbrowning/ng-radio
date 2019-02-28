import { Component, Input, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Router, Event, NavigationStart } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'responsive-sidenav-container',
  templateUrl: './responsive-sidenav.component.html',
  styleUrls: ['./responsive-sidenav.component.scss']
})
export class ResponsiveSidenavComponent implements OnInit, OnDestroy {
  @Input() screenSizeCutoff = 800;
  @ViewChild('sideNav') sideNav: MatSidenav;
  private routerEventsSub: Subscription;

  constructor(private router: Router) {}

  ngOnInit() {
    this.routerEventsSub = this.router.events.subscribe(event => this.onRouterEvent(event));
  }

  ngOnDestroy() {
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

  public get smallScreen(): boolean {
    return window.innerWidth < this.screenSizeCutoff;
  }

  public toggle(): void {
    this.sideNav.toggle();
  }
}
