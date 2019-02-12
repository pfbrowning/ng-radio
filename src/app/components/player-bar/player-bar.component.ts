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
}