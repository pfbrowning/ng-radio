import { Component, ChangeDetectionStrategy } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { Store } from '@ngrx/store';
import { RootState } from '@core';
import { FavoriteStationsActions } from '@core/store/favorite-stations';

@Component({
  selector: 'blr-side-nav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidenavComponent {
  constructor(private store: Store<RootState>, private oauthService: OAuthService) {}

  public onCustomStationClicked(): void {
    this.store.dispatch(FavoriteStationsActions.openStationEditNew());
  }

  public onLogoutClicked() {
    this.oauthService.logOut();
  }
}
