import { Component } from '@angular/core';
import { PlayerService } from 'src/app/services/player.service';
import { SleepTimerService } from 'src/app/services/sleep-timer.service';
import { NoSleepService } from 'src/app/services/no-sleep.service';

@Component({
  selector: 'blr-player-bar',
  templateUrl: './player-bar.component.html',
  styleUrls: ['./player-bar.component.scss']
})
export class PlayerBarComponent {
  constructor(public playerService: PlayerService,
    public sleepTimerService: SleepTimerService,
    public noSleepService: NoSleepService) {}

  public onImgError(img: HTMLImageElement) {
    /* If the image didn't load properly, then use a default
    alternative image in its place.  However, first check to ensure
    that it's not the default image itself that's erroring out. */
    const altImage = '/assets/images/radio.svg';
    if (img.src !== altImage) {
      img.src = altImage;
    }
  }

  public onTimerSelected(length: number) {
    if (length != null) {
      this.sleepTimerService.setTimer(length);
    } else {
      this.sleepTimerService.cancelTimer();
    }
  }
}
