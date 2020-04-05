import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { RootState } from '@core';
import { selectIsStationSelected } from '@core/store/player';

@Component({
  selector: 'blr-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  constructor(private store: Store<RootState>) {}

  public stationSelected$ = this.store.pipe(select(selectIsStationSelected));
}
