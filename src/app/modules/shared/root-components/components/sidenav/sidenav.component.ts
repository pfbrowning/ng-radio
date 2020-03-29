import { Component } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';

@Component({
  selector: 'blr-side-nav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent {
  constructor(private oauthService: OAuthService) {}

  public onLogoutClicked() {
    this.oauthService.logOut();
  }
}
