import { Component, OnInit, Input, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { Station } from '@core/models/player';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { RootState } from '@core';
import { Store, select } from '@ngrx/store';
import { PlayerActions } from '@core/store';
import { FavoriteStationsActions, FavoriteStationsSelectors } from '@core/store/favorite-stations';
import { MatInput } from '@angular/material/input';
import { matProgressButtonDefaults } from '@core/constants';
import cloneDeep from 'lodash/cloneDeep';

@Component({
  selector: 'blr-station-edit',
  templateUrl: './station-edit.component.html',
  styleUrls: ['./station-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StationEditComponent implements OnInit {
  constructor(private store: Store<RootState>, private router: Router) { }

  @ViewChild('titleInput', { static: true }) titleInput: MatInput;
  @ViewChild('form', { static: true }) form: NgForm;
  @Input() existingStation: Station;
  public updateInProgressIds$ = this.store.pipe(select(FavoriteStationsSelectors.updateInProgressIds));
  public fetchingFavorites$ = this.store.pipe(select(FavoriteStationsSelectors.selectIsFavoriteStationFetchInProgress));
  public saving$ = this.store.pipe(select(FavoriteStationsSelectors.editStationSaveInProgress));
  public stationPending: Station;

  public openBtnOptions = {
    ...matProgressButtonDefaults,
    text: 'Open'
  };

  public saveBtnOptions = {
    ...matProgressButtonDefaults,
    text: 'Save'
  };

  public cancelBtnOptions = {
    ...matProgressButtonDefaults,
    text: 'Cancel'
  };

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
      this.store.dispatch(PlayerActions.selectStation({station: this.stationPending}));
      this.closeEditor();
      if (this.router.url !== '/now-playing') {
        this.router.navigate(['/now-playing']);
      }
    }
  }

  public onSaveClicked(): void {
    this.form.form.markAllAsTouched();
    if (this.form.valid) {
      this.store.dispatch(this.existingStation
        ? FavoriteStationsActions.stationUpdateStart({station: this.stationPending})
        : FavoriteStationsActions.addToFavoritesStart({station: this.stationPending})
      );
    }
  }
}
