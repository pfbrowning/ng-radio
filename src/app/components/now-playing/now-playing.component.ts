import { Component } from '@angular/core';
import { PlayerService } from 'src/app/services/player.service';
import { Utils } from 'src/app/utils/utils';
import { SleepTimerService } from 'src/app/services/sleep-timer.service';
import { NoSleepService } from 'src/app/services/no-sleep.service';
import { StreamInfoStatus } from 'src/app/models/stream-info-status';

@Component({
  templateUrl: './now-playing.component.html',
  styleUrls: ['./now-playing.component.scss']
})
export class NowPlayingComponent {
  constructor(public playerService: PlayerService,
    public sleepTimerService: SleepTimerService,
    public noSleepService: NoSleepService) {}

  public streamInfoStatus = StreamInfoStatus;

  public onImgError(img: HTMLImageElement, altSrc: string) {
    Utils.SetAltImage(img, altSrc);
  }

  public onTimerSelected(length: number) {
    if (length != null) {
      this.sleepTimerService.setTimer(length);
    } else {
      this.sleepTimerService.cancelTimer();
    }
  }
}
