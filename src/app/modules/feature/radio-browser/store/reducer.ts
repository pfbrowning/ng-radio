import { createReducer, on } from '@ngrx/store'
import { RadioBrowserSearchState } from '../models/radio-browser-search-state'
import { initialRadioBrowserSearchState } from '../models/initial-radio-browser-search-state'
import { RadioBrowserResultsActions } from '@core/store'
import * as RadioBrowserActions from './actions'

export const radioBrowserSearchFeatureKey = 'radioBrowserSearch'

export const radioBrowserSearchReducer = createReducer<RadioBrowserSearchState>(
    initialRadioBrowserSearchState,
    on(RadioBrowserActions.nameTermChanged, (state, { term }) => ({
        ...state,
        nameTerm: term,
    })),
    on(RadioBrowserActions.tagTermChanged, (state, { term }) => ({
        ...state,
        tagTerm: term,
    })),
    on(RadioBrowserActions.countryFilterChanged, (state, { text }) => ({
        ...state,
        countryFilter: text,
    })),
    on(RadioBrowserActions.countrySelected, (state, { country }) => ({
        ...state,
        country,
    })),
    on(RadioBrowserActions.searchStart, (state) => ({
        ...state,
        results: null,
        searchInProgress: true,
    })),
    on(RadioBrowserResultsActions.searchSucceeded, (state, { results }) => ({
        ...state,
        searchInProgress: false,
    })),
    on(RadioBrowserActions.searchFailed, (state) => ({
        ...state,
        searchInProgress: false,
    })),
    on(RadioBrowserActions.resolveSubmit, (state) => ({
        ...state,
        countriesFetchFailed: false,
    })),
    on(RadioBrowserActions.countriesFetchStart, (state) => ({
        ...state,
        countriesFetchInProgress: true,
        countriesFetchFailed: false,
    })),
    on(RadioBrowserActions.countriesFetchFailed, (state) => ({
        ...state,
        countriesFetchInProgress: false,
        countriesFetchFailed: true,
    })),
    on(RadioBrowserActions.countriesFetchSucceeded, (state, { countries }) => ({
        ...state,
        countriesFetchInProgress: false,
        countriesFetchFailed: false,
        countries,
    })),
    on(RadioBrowserActions.tagSuggestionsFetchStart, (state) => ({
        ...state,
        tagSuggestionsFetchInProgress: true,
    })),
    on(
        RadioBrowserActions.tagSuggestionsFetchSucceeded,
        (state, { tagSuggestions }) => ({
            ...state,
            /* We can't limit the tags returned by the API, so we have to fetch all and limit client-side.
    I think this is reducer logic for the time being, but it can be moved to the effects when and
    if it becomes valuable to wrap the limit behind a configuration value. */
            tagSuggestions: tagSuggestions.slice(0, 100),
            tagSuggestionsFetchInProgress: false,
        })
    ),
    on(RadioBrowserActions.tagSuggestionsFetchFailed, (state) => ({
        ...state,
        tagSuggestions: null,
        tagSuggestionsFetchInProgress: false,
    }))
)
