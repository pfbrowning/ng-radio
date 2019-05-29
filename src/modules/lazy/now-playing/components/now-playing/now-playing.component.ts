import { Component, ChangeDetectorRef, OnInit, OnDestroy } from '@angular/core';
import { KeepAwakeService } from '@modules/core/keep-awake/keep-awake.module';
import { SleepTimerService, StreamInfoStatus, PlayerService } from '@modules/core/core-radio-logic/core-radio-logic.module';
import { NotificationService, Severities } from '@modules/core/notifications/notifications.module';
import { Subscription, merge } from 'rxjs';
import { delay } from 'rxjs/operators';
import { setAltSrc } from '@utilities';

@Component({
  templateUrl: './now-playing.component.html',
  styleUrls: ['./now-playing.component.scss']
})
export class NowPlayingComponent implements OnInit, OnDestroy {
  constructor(public playerService: PlayerService,
    public sleepTimerService: SleepTimerService,
    public keepAwakeService: KeepAwakeService,
    private notificationService: NotificationService,
    private changeDetectorRef: ChangeDetectorRef) {}

  public streamInfoStatus = StreamInfoStatus;
  private changeDetectionSubscription: Subscription;

  public ngOnInit() {
    // When the play / pause state or the now playing info canged
    this.changeDetectionSubscription = merge(
      this.playerService.nowPlaying$,
      this.playerService.paused$
    )
    /* Delay for 0ms to wait for the async
    pipe bindings to catch up. */
    .pipe(delay(0))
    .subscribe(() => this.changeDetectorRef.detectChanges());
  }

  ngOnDestroy() {
    if (this.changeDetectionSubscription) { this.changeDetectionSubscription.unsubscribe(); }
  }

  public onImgError(img: HTMLImageElement, altSrc: string) {
    setAltSrc(img, altSrc);
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
