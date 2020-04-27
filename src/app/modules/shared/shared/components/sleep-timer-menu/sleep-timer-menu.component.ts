import { Component, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { MatMenu } from '@angular/material/menu';
import { RootState } from '@core';
import { Store } from '@ngrx/store';
import { SleepTimerActions } from '@core/store';

@Component({
  selector: 'blr-sleep-timer-menu',
  templateUrl: './sleep-timer-menu.component.html',
  styleUrls: ['./sleep-timer-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SleepTimerMenuComponent {
  constructor(private store: Store<RootState>) {}

  @ViewChild('menu', { static: true }) menu: MatMenu;

  public onTimerSelected(minutes: number): void {
    this.store.dispatch(SleepTimerActions.setSleepTimerSubmit({minutes}));
  }

  public onCancelTimerClicked(): void {
    this.store.dispatch(SleepTimerActions.clearSleepTimer());
  }
}
