import { Component, ChangeDetectionStrategy, OnDestroy, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { RootState } from '@core';
import { ConfirmationService } from 'primeng/api';
import { selectFavoriteStationRows, removeFromFavoritesStart, FavoriteStationsActions } from '@core/store/favorite-stations';
import { Station } from '@core/models/player';
import { take } from 'rxjs/operators';
import { PlayerActions, PlayerSelectors } from '@core/store';

@Component({
  selector: 'blr-favorite-stations',
  templateUrl: './favorite-stations.component.html',
  styleUrls: ['./favorite-stations.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FavoriteStationsComponent implements OnInit, OnDestroy {
  constructor(private store: Store<RootState>, private confirmationService: ConfirmationService) { }

  public columns = ['name', 'now-playing', 'actions'];

  public stationRows$ = this.store.pipe(select(selectFavoriteStationRows));
  public streamInfo$ = this.store.pipe(select(PlayerSelectors.streamInfo));

  public ngOnInit(): void {
    this.stationRows$.pipe(take(1)).subscribe(rows =>
      this.store.dispatch(PlayerActions.selectStreamInfoUrls({streamUrls: rows.map(r => r.station.url)})
    ));
  }

  ngOnDestroy(): void {
    this.store.dispatch(PlayerActions.clearStreamInfoUrls());
  }

  public onRowClicked(station: Station): void {
    this.store.dispatch(PlayerActions.selectStation({station}));
  }

  public onDeleteClicked(station: Station, event): void {
    // Don't propagate up to row click
    event.stopPropagation();
    this.confirmationService.confirm({
      message: `Are you sure you want to delete ${station.title}?`,
      accept: () => this.store.dispatch(removeFromFavoritesStart({stationId: station.stationId}))
    });
  }

  public onEditClicked(station: Station, event): void {
    // Don't propagate up to row click
    event.stopPropagation();
    this.store.dispatch(FavoriteStationsActions.openStationEditExisting({stationId: station.stationId}));
  }
}
