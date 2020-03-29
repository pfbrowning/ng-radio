import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StationLookupService } from './services/station-lookup.service';
import { StreamInfoService } from './services/stream-info.service';
import { AudioElement } from './models/audio-element';
import { AudioElementToken } from './injection-tokens/audio-element-token';
import { HttpClientModule } from '@angular/common/http';
import { KeepAwakeService } from './services/keep-awake.service';
import { NoSleepToken } from './injection-tokens/no-sleep-token';
import { WindowToken } from './injection-tokens/window-token';
import { AudioElementEventListenerService } from './services/audio-element-event-listener.service';
import { CurrentTimeService } from './services/current-time.service';
import * as NoSleep from 'nosleep.js';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HttpClientModule
  ],
  providers: [
    StationLookupService,
    StreamInfoService,
    KeepAwakeService,
    AudioElementEventListenerService,
    CurrentTimeService,
    { provide: NoSleepToken, useValue: new NoSleep() },
    { provide: AudioElementToken, useValue: new AudioElement() },
    { provide: WindowToken, useValue: window },
  ]
})
export class CoreModule {}