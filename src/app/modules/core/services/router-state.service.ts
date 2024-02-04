import { Injectable } from '@angular/core';
import {
  Event,
  Router,
  RouterEvent,
  NavigationStart,
  NavigationEnd,
  NavigationCancel,
  NavigationError,
} from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { filter } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class RouterStateService {
  private navigationInProgressSource = new BehaviorSubject<boolean>(false);
  public navigationInProgress$ = this.navigationInProgressSource.asObservable();

  constructor(private router: Router) {
    router.events
      .pipe(filter((e: Event | RouterEvent): e is RouterEvent => e instanceof RouterEvent))
      .subscribe((routerEvent: RouterEvent) => this.onRouterEvent(routerEvent));
  }

  public onRouterEvent(routerEvent: RouterEvent) {
    if (routerEvent instanceof NavigationStart) {
      this.navigationInProgressSource.next(true);
    }

    if (
      routerEvent instanceof NavigationEnd ||
      routerEvent instanceof NavigationCancel ||
      routerEvent instanceof NavigationError
    ) {
      this.navigationInProgressSource.next(false);
    }
  }
}
