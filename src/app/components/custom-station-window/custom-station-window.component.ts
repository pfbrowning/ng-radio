import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ModalWindowComponent } from '@browninglogic/ng-modal';
import { Station } from 'src/app/models/station';
import { PlayerService } from 'src/app/services/player.service';
import { clone } from 'lodash';

@Component({
  selector: 'blr-custom-station-window',
  templateUrl: './custom-station-window.component.html',
  styleUrls: ['./custom-station-window.component.scss']
})
export class CustomStationWindowComponent {
  constructor(private playerService: PlayerService) {}

  @ViewChild('modal') modal: ModalWindowComponent;
  public station: Station = new Station();
  public urlPattern = 'https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{2,256}\\.[a-z]{2,6}\\b([-a-zA-Z0-9@:%_\\+.~#?&//=]*)';

  public show(): void {
    this.modal.show();
  }

  resetAndHide(form: NgForm) {
    form.resetForm();
    this.modal.hide();
  }

  onSubmit(form: NgForm) {
    if (form.valid) {
      /* Clone the station model before passing it on to
      the player service because the object reference will
      be cleared once we reset the form. */
      this.playerService.playStation(clone(this.station));
      this.resetAndHide(form);
    }
  }
}
