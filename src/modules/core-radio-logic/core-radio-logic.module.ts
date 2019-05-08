import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayerService } from './services/player.service';
import { SleepTimerService } from './services/sleep-timer.service';
import { StationLookupService } from './services/station-lookup.service';
import { StreamInfoService } from './services/stream-info.service';
import { AudioElement } from './models/audio-element';
import { AudioElementToken } from './injection-tokens/audio-element-token';

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [
    StationLookupService,
    PlayerService,
    SleepTimerService,
    StreamInfoService,
    { provide: AudioElementToken, useValue: new AudioElement() },
  ]
})
export class CoreRadioLogicModule {}

export { PlayerService, SleepTimerService, StationLookupService,
  StreamInfoService, AudioElement, AudioElementToken };

export { NowPlaying } from './models/now-playing';
export { Station } from './models/station';
export { StreamInfo } from './models/stream-info';
export { StreamInfoStatus } from './models/stream-info-status';
