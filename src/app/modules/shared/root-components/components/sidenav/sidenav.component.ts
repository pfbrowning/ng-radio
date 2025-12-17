import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';
import { RootState } from '@core';
import { FavoriteStationsActions } from '@core/store';
import { AuthenticationFacadeService } from '@core/store';

@Component({
    selector: 'blr-side-nav',
    templateUrl: './sidenav.component.html',
    styleUrls: ['./sidenav.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class SidenavComponent {
  public authenticated$ = this.authenticationFacade.authenticated$;

  constructor(
    private store: Store<RootState>,
    private authenticationFacade: AuthenticationFacadeService
  ) {}

  public onCustomStationClicked(): void {
    this.store.dispatch(FavoriteStationsActions.openStationEditNew());
  }

  public onLogoutClicked() {
    this.authenticationFacade.logoutButtonClicked();
  }

  public onLoginClicked() {
    this.authenticationFacade.logInRedirect();
  }
}
