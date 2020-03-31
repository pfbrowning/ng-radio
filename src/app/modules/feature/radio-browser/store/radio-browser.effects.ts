import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { switchMap, withLatestFrom, map, catchError } from 'rxjs/operators';
import { StationLookupService } from '@core';
import { selectSearchCriteria } from './radio-browser.selectors';
import { of } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { RadioBrowserRootState } from '../models/radio-browser-root-state';
import * as RadioBrowserActions from './radio-browser.actions';

@Injectable()
export class RadioBrowserEffects {
  searchOnTermsUpdated$ = createEffect(() => this.actions$.pipe(
    ofType(RadioBrowserActions.nameTermUpdated, RadioBrowserActions.tagTermUpdated),
    map(() => RadioBrowserActions.searchStart())
  ));

  performSearch$ = createEffect(() => this.actions$.pipe(
    ofType(RadioBrowserActions.searchStart),
    withLatestFrom(this.store.pipe(select(selectSearchCriteria))),
    switchMap(([action, criteria]) => this.stationLookupService.search(criteria.nameTerm, criteria.tagTerm).pipe(
        map(results => RadioBrowserActions.searchSucceeded({results})),
        catchError(error => of(RadioBrowserActions.searchFailed({error})))
    ))
  ));

  constructor(
    private actions$: Actions,
    private store: Store<RadioBrowserRootState>,
    private stationLookupService: StationLookupService
  ) {}
}
