import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SuggestedStations } from '../../models/suggested-stations';
import { RootState } from '@root-state';
import { Store } from '@ngrx/store';
import { selectStation, Station } from '@root-state/player';

@Component({
  selector: 'blr-suggested-stations',
  templateUrl: './suggested-stations.component.html',
  styleUrls: ['./suggested-stations.component.scss']
})
export class SuggestedStationsComponent implements OnInit {
  constructor(
    private activatedRoute: ActivatedRoute,
    private store: Store<RootState>
  ) {}

  public developerSuggested: Array<Station>;
  public radioBrowserTopClicked: Array<Station>;
  public radioBrowserTopVoted: Array<Station>;

  ngOnInit() {
    this.activatedRoute.data.subscribe((data: { suggestedStations: SuggestedStations }) => {
      this.developerSuggested = data.suggestedStations.developerSuggested;
      this.radioBrowserTopClicked = data.suggestedStations.topClicked;
      this.radioBrowserTopVoted = data.suggestedStations.topVoted;
    });
  }

  onStationSelected(station: Station) {
    this.store.dispatch(selectStation({station}));
  }
}
