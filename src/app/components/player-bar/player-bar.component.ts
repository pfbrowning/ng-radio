import { Component, OnInit } from '@angular/core';
import { PlayerService } from 'src/app/services/player.service';
import { NowPlaying } from 'src/app/models/now-playing';

@Component({
  selector: 'player-bar',
  templateUrl: './player-bar.component.html',
  styleUrls: ['./player-bar.component.scss']
})
export class PlayerBarComponent {
  constructor(private playerService: PlayerService) {}

  public get nowPlaying(): NowPlaying {
    return this.playerService.nowPlaying;
  }

  public get paused(): boolean {
    return this.playerService.paused;
  }

  public get stationSelected(): boolean {
    return this.playerService.stationSelected
  }

  public onPlayClicked() {
    this.playerService.play();
  }

  public onPauseClicked() {
    this.playerService.pause();
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