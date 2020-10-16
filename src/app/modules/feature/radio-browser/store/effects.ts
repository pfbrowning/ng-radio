import { Injectable } from '@angular/core'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import {
    switchMap,
    withLatestFrom,
    map,
    catchError,
    tap,
    filter,
} from 'rxjs/operators'
import { of } from 'rxjs'
import { Store, select } from '@ngrx/store'
import { RadioBrowserSearchRootState } from '../models/radio-browser-search-root-state'
import { resolverParams } from './selectors'
import {
    NotificationsService,
    RadioBrowserService,
    ConfigService,
} from '@core/services'
import { RadioBrowserResultsActions } from '@core/store'
import * as RadioBrowserSearchActions from './actions'
import * as RadioBrowserSearchSelectors from './selectors'

@Injectable()
export class RadioBrowserSearchEffects {
    resolveInit$ = createEffect(() =>
        this.actions$.pipe(
            ofType(RadioBrowserSearchActions.resolveSubmit),
            withLatestFrom(this.store.pipe(select(resolverParams))),
            filter(
                ([, selected]) =>
                    selected.countries == null && !selected.fetching
            ),
            map(() => RadioBrowserSearchActions.countriesFetchStart())
        )
    )

    fetchCountries$ = createEffect(() =>
        this.actions$.pipe(
            ofType(RadioBrowserSearchActions.countriesFetchStart),
            switchMap(() =>
                this.radioBrowserService.fetchListedCountries().pipe(
                    map((countries) =>
                        RadioBrowserSearchActions.countriesFetchSucceeded({
                            countries,
                        })
                    ),
                    catchError((error) =>
                        of(
                            RadioBrowserSearchActions.countriesFetchFailed({
                                error,
                            })
                        )
                    )
                )
            )
        )
    )

    fetchTagSuggestions$ = createEffect(() =>
        this.actions$.pipe(
            ofType(RadioBrowserSearchActions.tagSuggestionsFetchStart),
            withLatestFrom(
                this.store.pipe(
                    select(RadioBrowserSearchSelectors.searchCriteria)
                )
            ),
            switchMap(([, { tagTerm }]) =>
                this.radioBrowserService.fetchTags(tagTerm).pipe(
                    map((tagSuggestions) =>
                        RadioBrowserSearchActions.tagSuggestionsFetchSucceeded({
                            tagSuggestions,
                        })
                    ),
                    catchError((error) =>
                        of(
                            RadioBrowserSearchActions.tagSuggestionsFetchFailed(
                                { error }
                            )
                        )
                    )
                )
            )
        )
    )

    searchOnTermsUpdated$ = createEffect(() =>
        this.actions$.pipe(
            ofType(
                RadioBrowserSearchActions.nameTermChanged,
                RadioBrowserSearchActions.tagTermChanged,
                RadioBrowserSearchActions.countrySelected
            ),
            map(() => RadioBrowserSearchActions.searchStart())
        )
    )

    fetchTagSuggestionsOnTermUpdated$ = createEffect(() =>
        this.actions$.pipe(
            ofType(RadioBrowserSearchActions.tagTermChanged),
            map(() => RadioBrowserSearchActions.tagSuggestionsFetchStart())
        )
    )

    fetchTagSuggestionsOnInitialFocus$ = createEffect(() =>
        this.actions$.pipe(
            ofType(RadioBrowserSearchActions.tagInputFocused),
            withLatestFrom(
                this.store.pipe(
                    select(RadioBrowserSearchSelectors.tagSuggestions)
                )
            ),
            filter(([, suggestions]) => suggestions == null),
            map(() => RadioBrowserSearchActions.tagSuggestionsFetchStart())
        )
    )

    performSearch$ = createEffect(() =>
        this.actions$.pipe(
            ofType(RadioBrowserSearchActions.searchStart),
            withLatestFrom(
                this.store.pipe(
                    select(RadioBrowserSearchSelectors.searchCriteria)
                ),
                this.configService.appConfig$
            ),
            switchMap(([, criteria, config]) =>
                this.radioBrowserService
                    .search(
                        criteria.nameTerm,
                        criteria.country,
                        criteria.tagTerm,
                        config.radioBrowserSearchResultsLimit
                    )
                    .pipe(
                        map((results) =>
                            RadioBrowserResultsActions.searchSucceeded({
                                results,
                            })
                        ),
                        catchError((error) =>
                            of(
                                RadioBrowserSearchActions.searchFailed({
                                    error,
                                })
                            )
                        )
                    )
            )
        )
    )

    notifySearchFailed$ = createEffect(
        () =>
            this.actions$.pipe(
                ofType(RadioBrowserSearchActions.searchFailed),
                tap(() => this.notificationsService.error('Search Failed'))
            ),
        { dispatch: false }
    )

    notifyTagSuggestionsFetchFailed$ = createEffect(
        () =>
            this.actions$.pipe(
                ofType(RadioBrowserSearchActions.tagSuggestionsFetchFailed),
                tap(() =>
                    this.notificationsService.error(
                        'Failed To Fetch Tag Suggestions'
                    )
                )
            ),
        { dispatch: false }
    )

    constructor(
        private actions$: Actions,
        private store: Store<RadioBrowserSearchRootState>,
        private configService: ConfigService,
        private radioBrowserService: RadioBrowserService,
        private notificationsService: NotificationsService
    ) {}
}
