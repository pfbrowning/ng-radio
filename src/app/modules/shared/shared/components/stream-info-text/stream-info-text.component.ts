import { Component, Input, ChangeDetectionStrategy, OnChanges } from '@angular/core';

@Component({
  selector: 'blr-stream-info-text',
  templateUrl: './stream-info-text.component.html',
  styleUrls: ['./stream-info-text.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
// TODO Should we rename this to MetadataTextComponent?
export class StreamInfoTextComponent {
  /* There's not much reason for this to be its own component in its current form since all it does is show a string of text,
  however my intention is to update the radio proxy to include extra metadata from the stream header to fall back on when the
  title string is empty.  At that point, this is where that "what should I display" logic will live.  If I decide not to go in
  that direct, then at that point removing this component will be the appropriate thing to do. */
  @Input() metadata: string;
}
