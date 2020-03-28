import { Component, ViewChild, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { PlayerService, Station } from '@core';
import { clone } from 'lodash';
import { MatInput } from '@angular/material/input';

@Component({
  selector: 'blr-custom-station',
  templateUrl: './custom-station.component.html',
  styleUrls: ['./custom-station.component.scss']
})
export class CustomStationComponent implements OnInit {
  constructor(private playerService: PlayerService,
    private router: Router) {}

  @ViewChild('titleInput', { static: true }) titleInput: MatInput;
  public station: Station = new Station();

  ngOnInit() {
    /* Focus the title input on init so that the user can start typing
    right away without having to explicitly click or select the input. */
    this.titleInput.focus();
  }

  onSubmit(form: NgForm) {
    if (form.valid) {
      /* Clone the station model before passing it on to
      the player service because the object reference will
      be cleared once we reset the form. */
      this.playerService.playStation(clone(this.station));
      this.router.navigate(['/app', 'now-playing']);
    }
  }
}
