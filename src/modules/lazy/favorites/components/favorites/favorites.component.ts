import { Component } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { RootState } from '@root-state';
import { selectFavoriteStations } from '@root-state/favorite-stations';

@Component({
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss']
})
export class FavoritesComponent {
  constructor(private store: Store<RootState>) { }

  public columns = ['name', 'icon'];
  public loading = false;

  public stations$ = this.store.pipe(select(selectFavoriteStations));

}
