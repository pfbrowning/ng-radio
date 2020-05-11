import { Component } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { RootState } from '@core';
import { PlayerSelectors } from '@core/store';
import { FavoriteStationsSelectors } from '@core/store/favorite-stations';

@Component({
  selector: 'blr-app-shell',
  templateUrl: './app-shell.component.html',
  styleUrls: ['./app-shell.component.scss']
})
export class AppShellComponent {
  constructor(private store: Store<RootState>) {}

  public stationSelected$ = this.store.pipe(select(PlayerSelectors.selectIsStationSelected));
  public editStationExisting$ = this.store.pipe(select(FavoriteStationsSelectors.editStationExisting));
  public editingNewStation$ = this.store.pipe(select(FavoriteStationsSelectors.editingNewStation));
}
