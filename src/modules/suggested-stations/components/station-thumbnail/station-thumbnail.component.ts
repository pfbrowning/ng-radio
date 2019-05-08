import { Component, Input } from '@angular/core';
import { Station } from '@modules/core-radio-logic/core-radio-logic.module';
import { Utils } from 'src/app/utils/utils';

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
    Utils.SetAltImage(img, this.altImage);
  }

  /** Use the alt image if the loaded image is smaller thana the specified min width or height */
  public onImgLoad(img: HTMLImageElement) {
    if (img.width < this.minImgWidth || img.height < this.minImgHeight) {
      Utils.SetAltImage(img, this.altImage);
    }
  }
}
