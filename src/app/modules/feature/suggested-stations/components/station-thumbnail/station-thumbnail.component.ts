import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { Station } from '@core/models/player';

@Component({
    selector: 'blr-station-thumbnail',
    templateUrl: './station-thumbnail.component.html',
    styleUrls: ['./station-thumbnail.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StationThumbnailComponent {
    @Input() station: Station;
}
