import { Component } from '@angular/core';
import { AudioElementEventListenerService, OauthEventListenerService } from '@core';

@Component({
  selector: 'blr-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(
    private audioElementEventListenerService: AudioElementEventListenerService,
    private oauthEventListenerService: OauthEventListenerService
  ) {}
}
