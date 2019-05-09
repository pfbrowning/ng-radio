import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Station } from '@modules/core/core-radio-logic/core-radio-logic.module';

@Component({
  selector: 'blr-suggested-stations-section',
  templateUrl: './suggested-stations-section.component.html',
  styleUrls: ['./suggested-stations-section.component.scss']
})
export class SuggestedStationsSectionComponent {
  @Input() stations: Array<Station>;
  @Input() header: string;
  @Output() stationSelected = new EventEmitter<Station>();

  onStationClicked(station: Station) {
    this.stationSelected.emit(station);
  }

}
