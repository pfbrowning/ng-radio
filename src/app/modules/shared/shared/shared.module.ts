import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SleepTimerMenuComponent } from './components/sleep-timer-menu/sleep-timer-menu.component';
import { MatMenuModule } from '@angular/material/menu';
import { StreamInfoTextComponent } from './components/stream-info-text/stream-info-text.component';

@NgModule({
  imports: [
    CommonModule,
    MatMenuModule
  ],
  declarations: [ SleepTimerMenuComponent, StreamInfoTextComponent ],
  exports: [ SleepTimerMenuComponent, StreamInfoTextComponent ]
})
export class SharedModule { }
