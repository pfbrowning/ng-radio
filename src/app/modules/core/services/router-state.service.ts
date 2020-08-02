import { Injectable } from '@angular/core';
import { Router, RouterEvent, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RouterStateService {
  private navigationInProgressSource = new BehaviorSubject<boolean>(false);
  public navigationInProgress$ = this.navigationInProgressSource.asObservable();

  constructor(private router: Router) {
    this.router.events.subscribe((routerEvent: RouterEvent) => this.onRouterEvent(routerEvent));
  }

  public onRouterEvent(routerEvent: RouterEvent) {
    if (routerEvent instanceof NavigationStart) {
      this.navigationInProgressSource.next(true);
    }

    if (routerEvent instanceof NavigationEnd ||
      routerEvent instanceof NavigationCancel ||
      routerEvent instanceof NavigationError) {
      this.navigationInProgressSource.next(false);
    }
  }
}
