import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';
import { RootState } from '@core';
import { FavoriteStationsActions } from '@core/store/favorite-stations';
import { AuthenticationService } from '@core/services';
import { AuthenticationFacadeService } from '@core/store';

@Component({
  selector: 'blr-side-nav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidenavComponent {
  public authenticated$ = this.authenticationFacade.authenticated$;

  constructor(
    private store: Store<RootState>,
    private authenticationService: AuthenticationService,
    private authenticationFacade: AuthenticationFacadeService
  ) {}

  public onCustomStationClicked(): void {
    this.store.dispatch(FavoriteStationsActions.openStationEditNew());
  }

  public onLogoutClicked() {
    this.authenticationFacade.logoutButtonClicked();
  }

  public onLoginClicked() {
    this.authenticationService.logIn();
  }
}
