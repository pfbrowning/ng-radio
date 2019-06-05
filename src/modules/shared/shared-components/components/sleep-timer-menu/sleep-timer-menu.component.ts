import { Component, Output, EventEmitter, ViewChild } from '@angular/core';
import { MatMenu } from '@angular/material/menu';

@Component({
  selector: 'blr-sleep-timer-menu',
  templateUrl: './sleep-timer-menu.component.html',
  styleUrls: ['./sleep-timer-menu.component.scss']
})
export class SleepTimerMenuComponent {
  @Output() timerSelected = new EventEmitter<number>();
  @ViewChild('menu', { static: true }) menu: MatMenu;
}
