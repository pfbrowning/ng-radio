import { Component, OnInit } from '@angular/core';
import { ConfigService } from './services/config.service';
import { ErrorHandlingService } from './services/error-handling.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(private errorHandlingService: ErrorHandlingService,
    private configService: ConfigService) {}

  ngOnInit() {
    // If the root app config failed to load before bootstrap, then show an error message
    if (this.configService.initialized == false) {
      this.errorHandlingService.handleError(this.configService.initializationError, 'Failed to load configuration');
    }
  }
}