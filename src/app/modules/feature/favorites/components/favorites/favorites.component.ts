import { Component } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { RootState } from '@root-state';
import { Station } from '@core';
import { selectFavoriteStationRows, removeFromFavoritesStart } from '@root-state/favorite-stations';
import { ConfirmationService } from 'primeng/api';
import { selectStation } from '@root-state/player';

@Component({
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss']
})
export class FavoritesComponent {
  constructor(private store: Store<RootState>, private confirmationService: ConfirmationService) { }

  public columns = ['spinner', 'name', 'icon', 'actions'];

  public stationRows$ = this.store.pipe(select(selectFavoriteStationRows));

  public onRowClicked(station: Station): void {
    this.store.dispatch(selectStation({station}));
  }

  public onDeleteClicked(station: Station, event): void {
    // Don't propagate up to row click
    event.stopPropagation();
    this.confirmationService.confirm({
      message: `Are you sure you want to delete ${station.title}?`,
      accept: () => this.store.dispatch(removeFromFavoritesStart({stationId: station.stationId}))
    });
  }

}
