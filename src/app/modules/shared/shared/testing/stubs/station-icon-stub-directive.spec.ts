import { Directive, Input } from '@angular/core';

@Directive({
  selector: '[blrStationIcon]',
  standalone: false,
})
export class StationIconStubDirective {
  @Input() iconUrl: string;
  @Input() minWidth = 35;
  @Input() minHeight = 35;
}
