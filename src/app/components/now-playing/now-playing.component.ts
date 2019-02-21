import { Component, OnInit, OnDestroy } from '@angular/core';
import { PlayerService } from 'src/app/services/player.service';
import { Subscription } from 'rxjs';
import { NowPlaying } from 'src/app/models/now-playing';
import { Utils } from 'src/app/utils/utils';
import { SleepTimerService } from 'src/app/services/sleep-timer.service';

@Component({
  templateUrl: './now-playing.component.html',
  styleUrls: ['./now-playing.component.scss']
})
export class NowPlayingComponent implements OnInit, OnDestroy {
  constructor(public playerService: PlayerService,
    public sleepTimerService: SleepTimerService) {}

  public nowPlaying: NowPlaying;
  private nowPlayingSubscription: Subscription;

  ngOnInit() {
    this.nowPlayingSubscription = this.playerService.nowPlaying$
      .subscribe(nowPlaying => this.nowPlaying = nowPlaying);
  }

  ngOnDestroy() {
    if(this.nowPlayingSubscription) this.nowPlayingSubscription.unsubscribe();
  }

  public onImgError(img: HTMLImageElement, altSrc: string) {
    Utils.SetAltImage(img, altSrc);
  }

  public onTimerSelected(length: number) {
    if(length != null) {
      this.sleepTimerService.setTimer(length);
    }
    else {
      this.sleepTimerService.cancelTimer();
    }
  }
}