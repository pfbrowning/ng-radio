import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { PlayerActions } from '@core/store';
import { Station } from '@core/models/player';
import { selectDeveloperSuggested, selectTopClicked, selectTopVoted } from '../../store/suggested-stations.selectors';
import { SuggestedStationsRootState } from '../../models/suggested-stations-root-state';

@Component({
  selector: 'blr-suggested-stations',
  templateUrl: './suggested-stations.component.html',
  styleUrls: ['./suggested-stations.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SuggestedStationsComponent {
  constructor(private store: Store<SuggestedStationsRootState>) {}

  public developerSuggested$ = this.store.pipe(select(selectDeveloperSuggested));
  public topClicked$ = this.store.pipe(select(selectTopClicked));
  public topVoted$ = this.store.pipe(select(selectTopVoted));

  onStationSelected(station: Station) {
    this.store.dispatch(PlayerActions.selectStation({station}));
  }
}
