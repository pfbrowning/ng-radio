import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { RootState } from '@core';
import { ConfirmationService } from 'primeng/api';
import { selectFavoriteStationRows, removeFromFavoritesStart } from '@core/store/favorite-stations';
import { Station } from '@core/models/player';
import { selectStation } from '@core/store/player';

@Component({
  selector: 'blr-favorite-stations',
  templateUrl: './favorite-stations.component.html',
  styleUrls: ['./favorite-stations.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FavoriteStationsComponent {
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
