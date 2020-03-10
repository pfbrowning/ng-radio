import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { SleepTimerService, PlayerService } from '@modules/core/core-radio-logic/core-radio-logic.module';
import { KeepAwakeService } from '@modules/core/keep-awake/keep-awake.module';
import { setAltSrc } from '@utilities';
import { NotificationService, Severities } from '@modules/core/notifications/notifications.module';
import { Subscription, merge, timer } from 'rxjs';
import { delay, switchMap } from 'rxjs/operators';
import { PlayerBarStationInfoComponent } from '../player-bar-station-info/player-bar-station-info.component';

@Component({
  selector: 'blr-player-bar',
  templateUrl: './player-bar.component.html',
  styleUrls: ['./player-bar.component.scss']
})
export class PlayerBarComponent implements OnInit, OnDestroy {
  constructor(public playerService: PlayerService,
    public sleepTimerService: SleepTimerService,
    public keepAwakeService: KeepAwakeService,
    private notificationService: NotificationService,
    private changeDetectorRef: ChangeDetectorRef,
    private router: Router) {}

  private changeDetectionSubscription: Subscription;
  @ViewChild('stationInfo') stationInfo: PlayerBarStationInfoComponent;

  public ngOnInit() {
    // When the play / pause state or the now playing info canged
    this.changeDetectionSubscription = merge(
      this.playerService.nowPlaying$,
      this.playerService.paused$
    )
    /* Wait 0ms for the async pipe bindings to catch up.
    Use timer in place of delay because of
    https://github.com/angular/angular/issues/10127 */
    .pipe(switchMap(() => timer(0)))
    .subscribe(() => this.changeDetectorRef.detectChanges());
  }

  ngOnDestroy() {
    if (this.changeDetectionSubscription) { this.changeDetectionSubscription.unsubscribe(); }
  }

  public onImgError(img: HTMLImageElement) {
    setAltSrc(img, '/assets/images/radio.svg');
  }

  public onTimerSelected(length: number) {
    if (length != null) {
      this.sleepTimerService.setTimer(length);
    } else {
      this.sleepTimerService.cancelTimer();
    }
  }

  public onNowPlayingClicked(): void {
    /* When the user clicks on the now playing info in the player bar,
    take them to the now-playing component if they're not already
    there. */
    if (this.router.url !== '/now-playing') {
      console.log('navigating');
      this.router.navigate(['/app', 'now-playing']);
    }
  }

  public onAddToFavoritesClicked(): void {
    this.notificationService.notify(Severities.Info, 'Coming Soon', 'Favorites functionality coming soon!');
  }
}
