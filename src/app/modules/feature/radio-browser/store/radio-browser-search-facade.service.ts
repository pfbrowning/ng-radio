import { Injectable } from '@angular/core'
import { RadioBrowserSearchRootState } from '../models/radio-browser-search-root-state'
import { Store, select } from '@ngrx/store'
import { RadioBrowserResultsSelectors } from '@core/store'
import * as RadioBrowserSelectors from './selectors'
import * as RadioBrowserActions from './actions'

@Injectable({ providedIn: 'root' })
export class RadioBrowserSearchFacadeService {
    public selectedCountry$ = this.store.pipe(
        select(RadioBrowserSelectors.selectedCountry)
    )
    public countryFilter$ = this.store.pipe(
        select(RadioBrowserSelectors.countryFilter)
    )
    public filteredCountries$ = this.store.pipe(
        select(RadioBrowserSelectors.filteredCountries)
    )
    public tagSuggestions$ = this.store.pipe(
        select(RadioBrowserSelectors.tagSuggestions)
    )
    public fetchingTagSuggestions$ = this.store.pipe(
        select(RadioBrowserSelectors.fetchingTagSuggestions)
    )
    public searchResults$ = this.store.pipe(
        select(RadioBrowserResultsSelectors.radioBrowserResults)
    )
    public isSearchInProgress$ = this.store.pipe(
        select(RadioBrowserSelectors.selectIsSearchInProgress)
    )
    public searchCriteria$ = this.store.pipe(
        select(RadioBrowserSelectors.searchCriteria)
    )

    constructor(private store: Store<RadioBrowserSearchRootState>) {}

    public nameTermChanged(term: string) {
        this.store.dispatch(RadioBrowserActions.nameTermChanged({ term }))
    }

    public tagTermChanged(term: string) {
        this.store.dispatch(RadioBrowserActions.tagTermChanged({ term }))
    }

    public countryChanged(country: string): void {
        this.store.dispatch(RadioBrowserActions.countrySelected({ country }))
    }

    public countryFilterChanged(text: string): void {
        this.store.dispatch(RadioBrowserActions.countryFilterChanged({ text }))
    }

    public tagFocused(): void {
        this.store.dispatch(RadioBrowserActions.tagInputFocused())
    }
}
