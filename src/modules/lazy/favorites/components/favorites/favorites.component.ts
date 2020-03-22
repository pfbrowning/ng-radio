import { Component } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { RootState } from '@root-state';
import { PlayerService, Station } from '@core-radio-logic';
import { selectFavoriteStationRows, removeFromFavoritesStart } from '@root-state/favorite-stations';

@Component({
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss']
})
export class FavoritesComponent {
  constructor(private store: Store<RootState>, private playerService: PlayerService) { }

  public columns = ['spinner', 'name', 'icon', 'actions'];
  public loading = false;

  public stationRows$ = this.store.pipe(select(selectFavoriteStationRows));

  public onRowClicked(station: Station): void {
    this.playerService.playStation(station);
  }
  
  public onDeleteClicked(stationId: number): void {
    this.store.dispatch(removeFromFavoritesStart({stationId}));
  }

}
