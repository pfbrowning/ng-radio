import { Component, Output, EventEmitter, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { MatMenu } from '@angular/material/menu';

@Component({
  selector: 'blr-sleep-timer-menu',
  templateUrl: './sleep-timer-menu.component.html',
  styleUrls: ['./sleep-timer-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SleepTimerMenuComponent {
  @Output() timerSelected = new EventEmitter<number>();
  @ViewChild('menu', { static: true }) menu: MatMenu;
}
