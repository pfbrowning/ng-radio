import { Component, OnInit, OnDestroy, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { Subject, timer, EMPTY } from 'rxjs';
import { debounceTime, distinctUntilChanged, take, filter, debounce, map } from 'rxjs/operators';
import { MatInput } from '@angular/material/input';
import { Store, select } from '@ngrx/store';
import { PlayerActions, PlayerSelectors, StreamMetadataFacadeService } from '@core/store';
import { Station } from '@core/models/player';
import { SubSink } from 'subsink';
import { RadioBrowserSearchFacadeService } from '../../store/radio-browser-search-facade.service';
import { ConfigService } from '@core/services';
import { RadioBrowserSearchRootState } from '../../models/radio-browser-search-root-state';

@Component({
  templateUrl: './radio-browser.component.html',
  styleUrls: ['./radio-browser.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RadioBrowserComponent implements OnInit, OnDestroy {
  constructor(
    private store: Store<RadioBrowserSearchRootState>,
    private configService: ConfigService,
    private streamMetadataFacade: StreamMetadataFacadeService,
    private radioBrowserFacade: RadioBrowserSearchFacadeService,
  ) {}

  @ViewChild('nameSearchInput', { static: true }) nameSearchInput: MatInput;

  public columns = ['name', 'now-playing', 'tags', 'icon'];

  public resultsLimit$ = this.configService.appConfig$.pipe(map(config => config.radioBrowserSearchResultsLimit));
  public searchResults$ = this.radioBrowserFacade.searchResults$;
  public isSearchInProgress$ = this.radioBrowserFacade.isSearchInProgress$;
  public streamInfo$ = this.streamMetadataFacade.streamsMap$;
  public selectedCountry$ = this.radioBrowserFacade.selectedCountry$;
  public countryFilter$ = this.radioBrowserFacade.countryFilter$;
  public countries$ = this.radioBrowserFacade.filteredCountries$;
  public tagSuggestions$ = this.radioBrowserFacade.tagSuggestions$;
  public fetchingTagSuggestions$ = this.radioBrowserFacade.fetchingTagSuggestions$;
  public nameSearch$ = new Subject<string>(); 
  public tagSearch$ = new Subject<{tag: string, debounce: boolean}>();
  public nameSearch: string;
  public tagSearch: string;
  private debounceTime = 500;
  private subs = new SubSink();

  ngOnInit() {
    this.subs.sink = this.nameSearch$
      .pipe(debounceTime(this.debounceTime), distinctUntilChanged())
      .subscribe(term => this.radioBrowserFacade.nameTermChanged(term));
    this.subs.sink = this.tagSearch$.pipe(
      // Debounce conditionally
      debounce(t => t.debounce ? timer(this.debounceTime) : EMPTY),
      map(t => t.tag.toLowerCase()),
      distinctUntilChanged()
    ).subscribe(term => this.radioBrowserFacade.tagTermChanged(term));

    // Load any pre-existing search criteria from state on init
    this.radioBrowserFacade.searchCriteria$.pipe(take(1)).subscribe(criteria => {
      this.nameSearch = criteria.nameTerm;
      this.tagSearch = criteria.tagTerm;
    });

    // Focus on the name input
    this.nameSearchInput.focus();
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  onRowClicked(station: Station) {
    this.store.dispatch(PlayerActions.selectStation({station}));
  }

  onTagTermChanged(term: string) {
    this.tagSearch$.next({tag: term, debounce: true});
  }

  onTagTermSelected(term: string) {
    // Don't debounce if a value was selected via autocomplete
    this.tagSearch$.next({tag: term, debounce: false});
  }

  onNameTermChanged(term: string) {
    this.nameSearch$.next(term);
  }

  public onCountryChanged(country: string): void {
    this.radioBrowserFacade.countryChanged(country);
  }

  public onCountryFilterChanged(text: string): void {
    this.radioBrowserFacade.countryFilterChanged(text);
  }

  public onTagFocused(): void {
    this.radioBrowserFacade.tagFocused();
  }
}
