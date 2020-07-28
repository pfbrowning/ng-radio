import { Directive, Input, OnChanges, HostBinding, SimpleChanges, HostListener } from '@angular/core';

@Directive({
  selector: '[blrStationIcon]',
})
export class StationIconDirective implements OnChanges {
  @Input() iconUrl: string;
  @Input() minWidth = 35;
  @Input() minHeight = 35;
  @HostBinding() src;
  private invalidImageUrls = new Array<string>();

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.iconUrl) {
      this.checkUpdateSource();
    }
  }

  @HostListener('error', ['$event']) onError(event) {
    // When the image fails to load, mark it as invalid and checkUpdateSource in order to use the fallback image
    if (!this.invalidImageUrls.includes(this.src)) {
      this.invalidImageUrls.push(this.src);
      this.checkUpdateSource();
    }
  }

  @HostListener('load', ['$event']) onLoadComplete(event) {
    /* Once the image loads, if it's smaller than our min dimensions, then mark it as invalid and checkUpdateSource
    in order to use the fallback.  Intentionally check the rendered "width" & "height", rather than "naturalWidth"
    and "naturalHeight", because dimensionless images (such as svg) don't have proper natural dimensions. */
    const width = event.target.width;
    const height = event.target.width;
    const dimensionsValid = width >= this.minWidth && height >= this.minHeight;
    if (!dimensionsValid && !this.invalidImageUrls.includes(this.src)) {
      this.invalidImageUrls.push(this.src);
    }
    this.checkUpdateSource();
  }

  private checkUpdateSource(): void {
    // Use this image if the provided iconUrl is invalid for whatever reason
    const fallbackImage = '/assets/images/radio.svg';
    /* The icon is valid if it's a non-falsy string which hasn't already been marked as invalid
    as a result of failing to load or being too small. */
    const iconValid = this.iconUrl && !this.invalidImageUrls.includes(this.iconUrl);
    const intendedSource = iconValid ? this.iconUrl : fallbackImage;
    // Update the image src if it isn't already what we decided that it should be
    if (this.src !== intendedSource) {
      this.src = intendedSource;
    }
  }
}
