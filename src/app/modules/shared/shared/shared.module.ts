import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SleepTimerMenuComponent } from './components/sleep-timer-menu/sleep-timer-menu.component';
import { MatMenuModule } from '@angular/material/menu';
import { StreamInfoTextComponent } from './components/stream-info-text/stream-info-text.component';
import { StreamUrlValidatorDirective } from './directives/stream-url-validator.directive';
import { StationIconDirective } from './directives/station-icon.directive';

@NgModule({
  imports: [
    CommonModule,
    MatMenuModule
  ],
  declarations: [ SleepTimerMenuComponent, StreamInfoTextComponent, StreamUrlValidatorDirective, StationIconDirective ],
  exports: [ SleepTimerMenuComponent, StreamInfoTextComponent, StreamUrlValidatorDirective, StationIconDirective ]
})
export class SharedModule { }
