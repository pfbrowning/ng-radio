import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterStateService } from '@core/services';
import { AuthenticationFacadeService } from '@core/store';

@Component({
  selector: 'blr-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  constructor(
    private authenticationFacade: AuthenticationFacadeService,
    private routerStateService: RouterStateService
  ) {}

  public authInitialized$ = this.authenticationFacade.initialized$;
  public routeResolving$ = this.routerStateService.navigationInProgress$;
}
