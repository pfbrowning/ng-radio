import { Component, ChangeDetectorRef, OnInit, OnDestroy} from '@angular/core';
import { PlayerService } from 'src/app/services/player.service';
import { SleepTimerService } from 'src/app/services/sleep-timer.service';
import { NoSleepService } from 'src/app/services/no-sleep.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'blr-player-bar',
  templateUrl: './player-bar.component.html',
  styleUrls: ['./player-bar.component.scss']
})
export class PlayerBarComponent implements OnInit, OnDestroy {
  constructor(public playerService: PlayerService,
    public sleepTimerService: SleepTimerService,
    public noSleepService: NoSleepService,
    private changeDetectorRef: ChangeDetectorRef ) {}

  public audioPaused: boolean;
  private audioPausedSubscription: Subscription;

  ngOnInit() {
    // When the pause state changes
    this.audioPausedSubscription = this.playerService.paused.subscribe(paused => {
      // Bind the new value to the component for template binding
      this.audioPaused = paused;
      // Explicitly trigger change detection because Angular doesn't do it for us on Audio events
      this.changeDetectorRef.detectChanges();
    });
  }

  ngOnDestroy() {
    if (this.audioPausedSubscription) { this.audioPausedSubscription.unsubscribe(); }
  }

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
