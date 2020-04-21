import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { RootState } from '@core';
import { selectIsStationSelected } from '@core/store/player';
import { FavoriteStationsSelectors } from '@core/store/favorite-stations';

@Component({
  selector: 'blr-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  constructor(private store: Store<RootState>) {}

  public stationSelected$ = this.store.pipe(select(selectIsStationSelected));
  public editStationExisting$ = this.store.pipe(select(FavoriteStationsSelectors.editStationExisting));
  public editingNewStation$ = this.store.pipe(select(FavoriteStationsSelectors.editingNewStation));
}
