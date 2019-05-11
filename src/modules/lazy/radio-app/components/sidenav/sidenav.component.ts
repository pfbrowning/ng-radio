import { Component } from '@angular/core';
import { AuthenticationService } from '@modules/core/authentication/authentication.module';

@Component({
  selector: 'blr-side-nav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent {
  constructor(public authenticationService: AuthenticationService) {}
}
