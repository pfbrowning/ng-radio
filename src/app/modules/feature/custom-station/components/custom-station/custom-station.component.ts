import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { MatInput } from '@angular/material/input';
import { Store } from '@ngrx/store';
import { RootState } from '@core';
import { selectStation } from '@core/store/player';
import { Station } from '@core/models/player';
import cloneDeep from 'lodash/cloneDeep';

@Component({
  selector: 'blr-custom-station',
  templateUrl: './custom-station.component.html',
  styleUrls: ['./custom-station.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomStationComponent implements OnInit {
  constructor(private store: Store<RootState>, private router: Router) {}

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
      the state because the object reference will
      be cleared once we reset the form. */
      this.store.dispatch(selectStation({station: cloneDeep(this.station)}));
      this.router.navigate(['/now-playing']);
    }
  }
}
