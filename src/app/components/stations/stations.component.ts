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
    { title: 'Radio Metal On: The Heavy', url: 'http://188.165.212.92:8000/heavy128mp3', genre: 'Heavy Metal'},
    { title: 'Radio Metal On: The Thrasher', url: 'http://188.165.212.92:8020/thrasher128mp3', genre: 'Thrash Metal' },
    { title: 'Radio Caprice Speed Metal', url: 'http://79.111.119.111:9107/;', genre: 'Speed Metal' },
    { title: 'Radio Caprice Thrash Metal', url: 'http://79.120.77.11:9101/;', genre: 'Thrash Metal' },
    { title: 'Radio Caprice Heavy Metal', url: 'http://79.111.14.76:9061/;', genre: 'Heavy Metal' },
    { title: 'Radio Caprice Power Metal', url: 'http://79.120.77.11:9099/;', genre: 'Power Metal' }
  ]

  onRowClicked(station: Station) {
    this.playerService.playStation(station);
  }
}
