import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Subject, Subscription, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, finalize } from 'rxjs/operators';
import { PlayerService, StationLookupService, Station } from '@modules/core/core-radio-logic/core-radio-logic.module';
import isBlank from 'is-blank';
import { MatInput } from '@angular/material/input';

@Component({
  templateUrl: './radio-browser.component.html',
  styleUrls: ['./radio-browser.component.scss']
})
export class RadioBrowserComponent implements OnInit, OnDestroy {
  constructor(private playerService: PlayerService,
    private stationLookupService: StationLookupService) {}

  @ViewChild('nameSearchInput', { static: true }) nameSearchInput: MatInput;

  public columns = ['name', 'tags', 'icon'];
  public stations: Array<Station>;

  public nameSearch: string;
  public nameSearch$ = new Subject<string>();
  private nameSearchSub: Subscription;
  public tagSearch: string;
  public tagSearch$ = new Subject<string>();
  private tagSearchSub: Subscription;
  public loading = false;

  ngOnInit() {
    // Initialize typeahead search term subscriptions
    this.subscribeToTerm(this.nameSearchSub, this.nameSearch$);
    this.subscribeToTerm(this.tagSearchSub, this.tagSearch$);
    // Focus on the name input
    this.nameSearchInput.focus();
  }

  private subscribeToTerm(subscription: Subscription, term: Subject<string>) {
    subscription = term.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap(() => {
        // If no search criteria have been entered, then skip the search and just return an empty array
        if (isBlank(this.nameSearch) && isBlank(this.tagSearch)) {
          return of([]);
        }
        this.loading = true;
        this.stations = null;
        return this.stationLookupService.search(this.nameSearch, this.tagSearch).pipe(
          finalize(() => this.loading = false)
        );
      })
    ).subscribe(stations => this.stations = stations);
  }

  ngOnDestroy() {
    if (this.nameSearchSub) { this.nameSearchSub.unsubscribe(); }
    if (this.tagSearchSub) { this.tagSearchSub.unsubscribe(); }
  }

  onRowClicked(station: Station) {
    this.playerService.playStation(station);
  }
}
