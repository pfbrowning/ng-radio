import { PlayerStatus, Station } from '@core/models/player';
import {
  Component,
  Input,
} from '@angular/core';

@Component({
  selector: 'blr-player-bar-station-info',
  template: '',
})
export class PlayerBarStationInfoStubComponent {
  @Input() currentPlayerStatus: PlayerStatus;
  @Input() currentStation: Station;
  @Input() metadataForCurrentStation: string;
}
