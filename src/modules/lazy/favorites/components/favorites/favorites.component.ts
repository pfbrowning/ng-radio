import { Component, OnInit } from '@angular/core';
import { Station } from '@modules/core/core-radio-logic/models/station';
import { ActivatedRoute } from '@angular/router';

@Component({
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss']
})
export class FavoritesComponent implements OnInit {
  constructor(private activatedRoute: ActivatedRoute) { }

  public columns = ['name', 'icon'];
  public stations: Array<Station>;
  public loading = false;

  ngOnInit() {
    this.activatedRoute.data.subscribe((data: { favoriteStations: Array<Station> }) => this.stations = data.favoriteStations);
  }

}
