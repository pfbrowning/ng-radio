import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, Event, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { Subscription } from 'rxjs';
import { ConfigService } from '@modules/core/config/config.module';
import { ErrorHandlingService } from '@modules/core/error-handling/error-handling.module';
import { LoadingIndicatorService } from '@browninglogic/ng-loading-indicator';

@Component({
  selector: 'blr-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  constructor(private errorHandlingService: ErrorHandlingService,
    private loadingIndicatorService: LoadingIndicatorService,
    private configService: ConfigService,
    private router: Router) {}

  /** Subscription to Router Events for the purpose of handling
   * any router-events-based logic on an app-wide basis */
  private routerEventsSubscription: Subscription;

  ngOnInit() {
    // Subscribe to router events so that we can show & hide the loading indicator accordingly
    this.routerEventsSubscription = this.router.events.subscribe(event => this.onRouterEvent(event));
    /* If the root app config failed to load before bootstrap, this is a critical error and a big
    deal.  Log the error (if possible) and inform the user */
    if (this.configService.initialized === false) {
      this.errorHandlingService.handleError(this.configService.initializationError, 'Failed to load configuration');
    }
  }

  ngOnDestroy() {
    if (this.routerEventsSubscription) { this.routerEventsSubscription.unsubscribe(); }
  }

  /** Show the loading indicator while resolving route data */
  private onRouterEvent(routerEvent: Event) {
    switch (true) {
      case routerEvent instanceof NavigationStart:
        this.loadingIndicatorService.showLoadingIndicator();
        break;

      case routerEvent instanceof NavigationEnd:
      case routerEvent instanceof NavigationError:
      case routerEvent instanceof NavigationCancel:
        this.loadingIndicatorService.hideLoadingIndicator();
        break;

      default:
        break;
    }
  }
}
