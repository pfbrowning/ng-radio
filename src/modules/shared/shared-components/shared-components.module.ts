import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SleepTimerMenuComponent } from './components/sleep-timer-menu/sleep-timer-menu.component';
import { MatMenuModule } from '@angular/material';

@NgModule({
  declarations: [
    SleepTimerMenuComponent
  ],
  imports: [
    CommonModule,
    MatMenuModule
  ],
  exports: [
    SleepTimerMenuComponent
  ]
})
export class SharedComponentsModule { }

export { SleepTimerMenuComponent };
