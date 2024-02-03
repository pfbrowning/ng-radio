import { Component, OnInit, Input, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { Station } from '@core/models/player';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { RootState } from '@core';
import { Store } from '@ngrx/store';
import { PlayerActions } from '@core/store';
import { FavoriteStationsActions } from '@core/store';
import { MatLegacyInput as MatInput } from '@angular/material/legacy-input';
import { matProgressButtonDefaults } from '@core/constants';
import { cloneDeep } from 'lodash-es';

@Component({
  selector: 'blr-station-edit',
  templateUrl: './station-edit.component.html',
  styleUrls: ['./station-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StationEditComponent implements OnInit {
  constructor(private store: Store<RootState>, private router: Router) {}

  @ViewChild('titleInput', { static: true }) titleInput: MatInput;
  @ViewChild('form', { static: true }) form: NgForm;
  @Input() existingStation: Station;
  @Input() saveInProgress: boolean;
  @Input() fetchingFavorites: boolean;
  public stationPending: Station;

  public ngOnInit(): void {
    if (this.existingStation) {
      this.stationPending = cloneDeep(this.existingStation);
    } else {
      this.stationPending = new Station();
    }

    this.titleInput.focus();
    this.store.dispatch(FavoriteStationsActions.fetchStationsSubmit());
  }

  public onVisibleChanged(visible): void {
    if (!visible) {
      this.closeEditor();
    }
  }

  public closeEditor(): void {
    this.store.dispatch(FavoriteStationsActions.closeStationEdit());
  }

  public onOpenClicked(): void {
    this.form.form.markAllAsTouched();
    if (this.form.valid) {
      this.store.dispatch(PlayerActions.selectStation({ station: this.stationPending }));
      this.closeEditor();
      if (this.router.url !== '/now-playing') {
        this.router.navigate(['/now-playing']);
      }
    }
  }

  public onSaveClicked(): void {
    this.form.form.markAllAsTouched();
    if (this.form.valid) {
      this.store.dispatch(
        this.existingStation
          ? FavoriteStationsActions.stationUpdateStart({
              station: this.stationPending,
            })
          : FavoriteStationsActions.addToFavoritesStart({
              station: this.stationPending,
            })
      );
    }
  }
}
