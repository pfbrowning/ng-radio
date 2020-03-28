import { Component, Input } from '@angular/core';
import { Station } from '@core-radio-logic';
import { setAltSrc } from '@utilities';

@Component({
  selector: 'blr-station-thumbnail',
  templateUrl: './station-thumbnail.component.html',
  styleUrls: ['./station-thumbnail.component.scss']
})
export class StationThumbnailComponent {
  @Input() station: Station;
  @Input() minImgWidth = 30;
  @Input() minImgHeight = 30;
  @Input() altImage = '/assets/images/radio.svg';

  /** Use the alt image if the station icon doesn't exist or fails to load */
  public onImgError(img: HTMLImageElement) {
    setAltSrc(img, this.altImage);
  }

  /** Use the alt image if the loaded image is smaller than the specified min width or height */
  public onImgLoad(img: HTMLImageElement) {
    if (img.width < this.minImgWidth || img.height < this.minImgHeight) {
      setAltSrc(img, this.altImage);
    }
  }
}
