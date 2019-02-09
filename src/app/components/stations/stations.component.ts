import { Component, OnInit } from '@angular/core';
import { Station } from 'src/app/models/station';
import { PlayerService } from 'src/app/services/player.service';

@Component({
  templateUrl: './stations.component.html',
  styleUrls: ['./stations.component.scss']
})
export class StationsComponent {
  constructor(private playerService: PlayerService) {}

  public columns = ['title', 'url', 'genre'];

  public stations: Array<Station> = [
    { title: 'BBC World Service', url: 'http://bbcwssc.ic.llnwd.net/stream/bbcwssc_mp1_ws-eieuk', genre: 'News'},
    { title: 'Radio Metal On: The Heavy', url: 'http://188.165.212.92:8000/heavy128mp3', genre: 'Heavy Metal'}
  ]

  onRowClicked(station: Station) {
    this.playerService.playStation(station);
  }
}
