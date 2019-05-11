import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { PlayerService, Station } from '@modules/core/core-radio-logic/core-radio-logic.module';
import { clone } from 'lodash';

@Component({
  selector: 'blr-custom-station',
  templateUrl: './custom-station.component.html',
  styleUrls: ['./custom-station.component.scss']
})
export class CustomStationComponent {
  constructor(private playerService: PlayerService,
    private router: Router) {}

  public station: Station = new Station();
  public urlPattern = 'https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{2,256}\\.[a-z]{2,6}\\b([-a-zA-Z0-9@:%_\\+.~#?&//=]*)';

  onSubmit(form: NgForm) {
    if (form.valid) {
      /* Clone the station model before passing it on to
      the player service because the object reference will
      be cleared once we reset the form. */
      this.playerService.playStation(clone(this.station));
      this.router.navigate(['/now-playing']);
    }
  }
}