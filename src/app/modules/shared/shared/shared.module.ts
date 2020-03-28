import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SleepTimerMenuComponent } from './components/sleep-timer-menu/sleep-timer-menu.component';
import { MatMenuModule } from '@angular/material/menu';

@NgModule({
  imports: [
    CommonModule,
    MatMenuModule
  ],
  declarations: [ SleepTimerMenuComponent ],
  exports: [ SleepTimerMenuComponent ]
})
export class SharedModule { }
