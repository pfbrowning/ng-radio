import { Component } from '@angular/core';
import { AuthenticationService } from '@authentication';

@Component({
  selector: 'blr-side-nav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent {
  constructor(public authenticationService: AuthenticationService) {}
}
