import { Component, OnInit, OnDestroy } from '@angular/core';
import { PlayerService } from 'src/app/services/player.service';
import { RadioBrowserStation } from 'src/app/models/radio-browser-station';
import { Station } from 'src/app/models/station';
import { Subject, Subscription, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, finalize } from 'rxjs/operators';
import { RadioBrowserService } from 'src/app/services/radio-browser.service';
import { LoadingIndicatorService } from '@browninglogic/ng-loading-indicator';
import isBlank from 'is-blank';

@Component({
  templateUrl: './radio-browser.component.html',
  styleUrls: ['./radio-browser.component.scss']
})
export class RadioBrowserComponent implements OnInit, OnDestroy {
  constructor(private playerService: PlayerService, 
    private radioBrowserService: RadioBrowserService, 
    private loadingIndicatorService: LoadingIndicatorService) {}

  public columns = ['name', 'tags'];
  public stations: Array<RadioBrowserStation>;

  public nameSearch: string;
  public nameSearch$ = new Subject<string>();
  private nameSearchSub: Subscription;
  public tagSearch: string;
  public tagSearch$ = new Subject<string>();
  private tagSearchSub: Subscription;

  ngOnInit() {
    // Initialize typeahead search term subscriptions
    this.subscribeToTerm(this.nameSearchSub, this.nameSearch$);
    this.subscribeToTerm(this.tagSearchSub, this.tagSearch$);
  }

  private subscribeToTerm(subscription: Subscription, term: Subject<string>) {
    subscription = term.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap(() => {
        // If no search criteria have been entered, then skip the search and just return an empty array
        if(isBlank(this.nameSearch) && isBlank(this.tagSearch)) {
          return of([]);
        }
        // If search criteria were provided, then show the loader and perform the search
        this.loadingIndicatorService.showLoadingIndicator();
        return this.radioBrowserService.searchStations(this.nameSearch, this.tagSearch).pipe(
          finalize(() => this.loadingIndicatorService.hideLoadingIndicator())
        );
      })
    ).subscribe(stations => this.stations = stations);
  }

  ngOnDestroy() {
    if(this.nameSearchSub) this.nameSearchSub.unsubscribe();
    if(this.tagSearchSub) this.tagSearchSub.unsubscribe();
  }

  onRowClicked(rbStation: RadioBrowserStation) {
    let station = new Station(rbStation.name, rbStation.url, null, rbStation.favicon);
    this.playerService.playStation(station);
  }
}
