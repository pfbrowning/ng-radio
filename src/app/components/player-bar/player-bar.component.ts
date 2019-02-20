import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { PlayerService } from 'src/app/services/player.service';
import { NowPlaying } from 'src/app/models/now-playing';
import { Subscription } from 'rxjs';

@Component({
  selector: 'player-bar',
  templateUrl: './player-bar.component.html',
  styleUrls: ['./player-bar.component.scss']
})
export class PlayerBarComponent implements OnInit, OnDestroy {
  constructor(public playerService: PlayerService, 
    private changeDetectorRef: ChangeDetectorRef) {}

  public nowPlaying: NowPlaying;
  private nowPlayingSubscription: Subscription;

  ngOnInit() {
    /* Subscribe to nowPlaying changes and store them in 
    the component for template binding. */
    this.nowPlayingSubscription = this.playerService.nowPlaying$
      .subscribe(nowPlaying => {
        this.nowPlaying = nowPlaying;
        /* Explicitly detect changes after assigning nowPlaying
        so that the 'marquee' class can be properly assigned based
        on whether the nowPlaying data causes an overflow. */
        this.changeDetectorRef.detectChanges();
      });
  }

  ngOnDestroy() {
    if(this.nowPlayingSubscription) this.nowPlayingSubscription.unsubscribe();
  }

  public isElementOverflowing(element: HTMLElement) : boolean {
    var overflowX = element.offsetWidth < element.scrollWidth,
        overflowY = element.offsetHeight < element.scrollHeight;

    return (overflowX || overflowY);
  }

  public onImgError(img: HTMLImageElement) {
    /* If the image didn't load properly, then use a default
    alternative image in its place.  However, first check to ensure
    that it's not the default image itself that's erroring out. */
    let altImage = '/assets/images/radio.svg';
    if(img.src != altImage) {
      img.src = altImage;
    }
  }
}