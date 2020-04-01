import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { switchMap, withLatestFrom, map, catchError, tap } from 'rxjs/operators';
import { StationLookupService } from '@core';
import { selectSearchCriteria } from './radio-browser.selectors';
import { of } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { RadioBrowserRootState } from '../models/radio-browser-root-state';
import { NotificationService, Severities } from '@notifications';
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

  notifySearchFailed$ = createEffect(() => this.actions$.pipe(
    ofType(RadioBrowserActions.searchFailed),
    tap(() => this.notificationService.notify(Severities.Error, 'Search Failed'))
  ), { dispatch: false });

  constructor(
    private actions$: Actions,
    private store: Store<RadioBrowserRootState>,
    private stationLookupService: StationLookupService,
    private notificationService: NotificationService
  ) {}
}
