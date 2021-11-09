import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { Station } from '@core/models/player';

@Component({
  selector: 'blr-suggested-stations-section',
  templateUrl: './suggested-stations-section.component.html',
  styleUrls: ['./suggested-stations-section.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SuggestedStationsSectionComponent {
  @Input() stations: Station[];
  @Input() header: string;
  @Output() stationSelected = new EventEmitter<Station>();

  onStationClicked(station: Station) {
    this.stationSelected.emit(station);
  }
}
