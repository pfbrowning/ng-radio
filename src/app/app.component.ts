import { Component } from '@angular/core';
import { ScreenSizeService } from './services/screen-size.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ng-radio';

  constructor(public screenSizeService: ScreenSizeService) {}
}
