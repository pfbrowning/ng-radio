import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { switchMap, withLatestFrom, map, catchError, tap, filter } from 'rxjs/operators';
import { of } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { RadioBrowserRootState } from '../models/radio-browser-root-state';
import { RadioBrowserActions, RadioBrowserSelectors } from '.';
import { Router } from '@angular/router';
import { PlayerActions } from '@core/store';
import { resolverParams } from './radio-browser.selectors';
import { NotificationsService, RadioBrowserService, ConfigService } from '@core/services';

@Injectable()
export class RadioBrowserEffects {
  resolveInit$ = createEffect(() => this.actions$.pipe(
    ofType(RadioBrowserActions.resolveSubmit),
    withLatestFrom(this.store.pipe(select(resolverParams))),
    filter(([, selected]) => selected.countries == null && !selected.fetching),
    map(() => RadioBrowserActions.countriesFetchStart())
  ));

  fetchCountries$ = createEffect(() => this.actions$.pipe(
    ofType(RadioBrowserActions.countriesFetchStart),
    switchMap(() => this.radioBrowserService.fetchListedCountries().pipe(
      map(countries => RadioBrowserActions.countriesFetchSucceeded({countries})),
      catchError(error => of(RadioBrowserActions.countriesFetchFailed({error})))
    ))
  ));

  fetchTagSuggestions$ = createEffect(() => this.actions$.pipe(
    ofType(RadioBrowserActions.tagSuggestionsFetchStart),
    withLatestFrom(this.store.pipe(select(RadioBrowserSelectors.searchCriteria))),
    switchMap(([, {tagTerm}]) => this.radioBrowserService.fetchTags(tagTerm).pipe(
      map(tagSuggestions => RadioBrowserActions.tagSuggestionsFetchSucceeded({tagSuggestions})),
      catchError(error => of(RadioBrowserActions.tagSuggestionsFetchFailed({error})))
    ))
  ));

  searchOnTermsUpdated$ = createEffect(() => this.actions$.pipe(
    ofType(RadioBrowserActions.nameTermUpdated, RadioBrowserActions.tagTermUpdated, RadioBrowserActions.countrySelected),
    map(() => RadioBrowserActions.searchStart())
  ));

  fetchTagSuggestionsOnTermUpdated$ = createEffect(() => this.actions$.pipe(
    ofType(RadioBrowserActions.tagTermUpdated),
    map(() => RadioBrowserActions.tagSuggestionsFetchStart())
  ));

  fetchTagSuggestionsOnInitialFocus$ = createEffect(() => this.actions$.pipe(
    ofType(RadioBrowserActions.tagInputFocused),
    withLatestFrom(this.store.pipe(select(RadioBrowserSelectors.tagSuggestions))),
    filter(([, suggestions]) => suggestions == null),
    map(() => RadioBrowserActions.tagSuggestionsFetchStart())
  ));

  performSearch$ = createEffect(() => this.actions$.pipe(
    ofType(RadioBrowserActions.searchStart),
    withLatestFrom(
      this.store.pipe(select(RadioBrowserSelectors.searchCriteria)),
      this.configService.appConfig$
    ),
    switchMap(([, criteria, config]) => this.radioBrowserService.search(
      criteria.nameTerm,
      criteria.country,
      criteria.tagTerm,
      config.radioBrowserSearchResultsLimit
    ).pipe(
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
    tap(() => this.notificationsService.error('Search Failed'))
  ), { dispatch: false });

  notifyTagSuggestionsFetchFailed$ = createEffect(() => this.actions$.pipe(
    ofType(RadioBrowserActions.tagSuggestionsFetchFailed),
    tap(() => this.notificationsService.error('Failed To Fetch Tag Suggestions'))
  ), { dispatch: false });

  constructor(
    private actions$: Actions,
    private store: Store<RadioBrowserRootState>,
    private configService: ConfigService,
    private router: Router,
    private radioBrowserService: RadioBrowserService,
    private notificationsService: NotificationsService
  ) {}
}
