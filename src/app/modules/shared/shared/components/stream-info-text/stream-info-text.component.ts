import { Component, OnInit, Input } from '@angular/core';
import { Station, StreamInfoStatus } from '@core/models/player';
import { StreamInfo } from '@core/models/player';

@Component({
  selector: 'blr-stream-info-text',
  templateUrl: './stream-info-text.component.html',
  styleUrls: ['./stream-info-text.component.scss']
})
export class StreamInfoTextComponent {
  @Input() streamInfo: StreamInfo;
  
  public streamInfoStatus = StreamInfoStatus;
}
