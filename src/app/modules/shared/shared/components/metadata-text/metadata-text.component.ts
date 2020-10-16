import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'blr-metadata-text',
    templateUrl: './metadata-text.component.html',
    styleUrls: ['./metadata-text.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MetadataTextComponent {
    /* There's not much reason for this to be its own component in its current form since all it does is show a string of text,
  however my intention is to update the radio proxy to include extra metadata from the stream header to fall back on when the
  title string is empty.  At that point, this is where that "what should I display" logic will live.  If I decide not to go in
  that direction, then at that point removing this component will be the appropriate thing to do. */
    @Input() metadata: string;
}
