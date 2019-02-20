import { Component, OnInit } from '@angular/core';
import { Station } from 'src/app/models/station';
import { PlayerService } from 'src/app/services/player.service';

@Component({
  templateUrl: './stations.component.html',
  styleUrls: ['./stations.component.scss']
})
export class StationsComponent {
  constructor(private playerService: PlayerService) {}

  public columns = ['title', 'genre', 'icon'];

  public stations: Array<Station> = [
    { title: 'BBC World Service', url: 'http://bbcwssc.ic.llnwd.net/stream/bbcwssc_mp1_ws-eieuk', genre: 'News', iconUrl: null},
    { title: 'NPR Program Stream', url: 'https://nprdmp-live01-mp3.akacast.akamaistream.net/7/998/364916/v1/npr.akacast.akamaistream.net/nprdmp_live01_mp3', genre: 'Public Radio', iconUrl: 'https://www.npr.org/about/images/press/Logos/NPRLogo_RGB.png' },
    { title: 'WQXR', url: 'http://stream.wqxr.org/wqxr', genre: 'Classical', 'iconUrl': 'https://media2.wnyc.org/i/300/300/c/80/1/wqxr_square_logo.png' },
    { title: 'Radio Metal On: The Heavy', url: 'http://188.165.212.92:8000/heavy128mp3', genre: 'Heavy Metal', iconUrl: 'http://metalon.org/wordpress/wp-content/uploads/2016/06/cropped-metalon-logo-2-270x270.jpg'},
    { title: 'Radio Metal On: The Thrasher', url: 'http://188.165.212.92:8020/thrasher128mp3', genre: 'Thrash Metal', iconUrl: 'http://metalon.org/wordpress/wp-content/uploads/2016/06/cropped-metalon-logo-2-270x270.jpg'},
    { title: 'Radio Caprice Speed Metal', url: 'http://79.111.119.111:9107/;', genre: 'Speed Metal', iconUrl: 'http://radcap.ru/graf2/rclogo.png'},
    { title: 'Radio Caprice Thrash Metal', url: 'http://79.120.77.11:9101/;', genre: 'Thrash Metal', iconUrl: 'http://radcap.ru/graf2/rclogo.png'},
    { title: 'Radio Caprice Heavy Metal', url: 'http://79.111.14.76:9061/;', genre: 'Heavy Metal', iconUrl: 'http://radcap.ru/graf2/rclogo.png'},
    { title: 'Radio Caprice Power Metal', url: 'http://79.120.77.11:9099/;', genre: 'Power Metal', iconUrl: 'http://radcap.ru/graf2/rclogo.png'},
  ]

  onRowClicked(station: Station) {
    this.playerService.playStation(station);
  }
}