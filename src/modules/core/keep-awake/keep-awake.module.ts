import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NoSleepToken } from './injection-tokens/no-sleep-token';
import { KeepAwakeService } from './services/keep-awake.service';
import * as NoSleep from 'nosleep.js';

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [
    { provide: NoSleepToken, useValue: new NoSleep() },
    KeepAwakeService
  ]
})
export class KeepAwakeModule { }

export { KeepAwakeService }