import { Component, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { MatMenu } from '@angular/material/menu';
import { SleepTimerService } from '@core/services';

@Component({
  selector: 'blr-sleep-timer-menu',
  templateUrl: './sleep-timer-menu.component.html',
  styleUrls: ['./sleep-timer-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SleepTimerMenuComponent {
  constructor(private sleepTimerService: SleepTimerService) {}

  @ViewChild('menu', { static: true }) menu: MatMenu;

  public onTimerSelected(minutes: number): void {
    this.sleepTimerService.setTimer(minutes);
  }

  public onCancelTimerClicked(): void {
    this.sleepTimerService.clearSleepTimer();
  }
}
