import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { switchMap, withLatestFrom, map, catchError, tap, filter } from 'rxjs/operators';
import { StationLookupService } from '@core';
import { of } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { RadioBrowserRootState } from '../models/radio-browser-root-state';
import { NotificationService, Severities } from '@core';
import { RadioBrowserActions, RadioBrowserSelectors } from '.';
import { Router } from '@angular/router';
import { PlayerActions } from '@core/store/player';

@Injectable()
export class RadioBrowserEffects {
  searchOnTermsUpdated$ = createEffect(() => this.actions$.pipe(
    ofType(RadioBrowserActions.nameTermUpdated, RadioBrowserActions.tagTermUpdated),
    map(() => RadioBrowserActions.searchStart())
  ));

  performSearch$ = createEffect(() => this.actions$.pipe(
    ofType(RadioBrowserActions.searchStart),
    withLatestFrom(this.store.pipe(select(RadioBrowserSelectors.selectSearchCriteria))),
    switchMap(([, criteria]) => this.stationLookupService.search(criteria.nameTerm, criteria.tagTerm).pipe(
        map(results => RadioBrowserActions.searchSucceeded({results})),
        catchError(error => of(RadioBrowserActions.searchFailed({error})))
    ))
  ));

  updateListedStations$ = createEffect(() => this.actions$.pipe(
    ofType(RadioBrowserActions.searchSucceeded),
    filter(() => this.router.url === '/radio-browser'),
    map(({results}) => results.map(r => r.url)),
    map(streamUrls => PlayerActions.selectStreamInfoUrls({streamUrls}))
  ));

  notifySearchFailed$ = createEffect(() => this.actions$.pipe(
    ofType(RadioBrowserActions.searchFailed),
    tap(() => this.notificationService.notify(Severities.Error, 'Search Failed'))
  ), { dispatch: false });

  constructor(
    private actions$: Actions,
    private store: Store<RadioBrowserRootState>,
    private router: Router,
    private stationLookupService: StationLookupService,
    private notificationService: NotificationService
  ) {}
}
