import { Component, Input } from '@angular/core';
import { MetadataViewModel } from '@core/models';

@Component({
  selector: 'blr-stream-info-text',
  templateUrl: './stream-info-text.component.html',
  styleUrls: ['./stream-info-text.component.scss']
})
export class StreamInfoTextComponent {
  @Input() streamInfo: MetadataViewModel;
}
