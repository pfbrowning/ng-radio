import { Component } from '@angular/core';
import { PlayerService } from 'src/app/services/player.service';
import { Utils } from 'src/app/utils/utils';
import { SleepTimerService } from 'src/app/services/sleep-timer.service';
import { KeepAwakeService } from 'src/app/services/keep-awake.service';
import { StreamInfoStatus } from 'src/app/models/stream-info-status';
import { NotificationService, Severities } from 'src/app/services/notification.service';

@Component({
  templateUrl: './now-playing.component.html',
  styleUrls: ['./now-playing.component.scss']
})
export class NowPlayingComponent {
  constructor(public playerService: PlayerService,
    public sleepTimerService: SleepTimerService,
    public keepAwakeService: KeepAwakeService,
    private notificationService: NotificationService) {}

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

  public onAddToFavoritesClicked(): void {
    this.notificationService.notify(Severities.Info, 'Coming Soon', 'Favorites functionality coming soon!');
  }
}
