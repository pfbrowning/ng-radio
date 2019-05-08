import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PlayerService, Station } from '@modules/core-radio-logic/core-radio-logic.module';
import { SuggestedStations } from '../../models/suggested-stations';

@Component({
  selector: 'blr-suggested-stations',
  templateUrl: './suggested-stations.component.html',
  styleUrls: ['./suggested-stations.component.scss']
})
export class SuggestedStationsComponent implements OnInit {
  constructor(private playerService: PlayerService,
    private activatedRoute: ActivatedRoute) {}

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
    this.playerService.playStation(station);
  }
}
