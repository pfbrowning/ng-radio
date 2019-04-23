import { Component, OnInit, OnDestroy } from '@angular/core';
import { PlayerService } from 'src/app/services/player.service';
import { RadioBrowserStation } from 'src/app/models/radio-browser-station';
import { Station } from 'src/app/models/station';
import { Subject, Subscription, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, finalize } from 'rxjs/operators';
import { RadioBrowserService } from 'src/app/services/radio-browser.service';
import isBlank from 'is-blank';

@Component({
  templateUrl: './radio-browser.component.html',
  styleUrls: ['./radio-browser.component.scss']
})
export class RadioBrowserComponent implements OnInit, OnDestroy {
  constructor(private playerService: PlayerService,
    private radioBrowserService: RadioBrowserService) {}

  public columns = ['name', 'tags', 'icon'];
  public stations: Array<RadioBrowserStation>;

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
        return this.radioBrowserService.searchStations(this.nameSearch, this.tagSearch).pipe(
          finalize(() => this.loading = false)
        );
      })
    ).subscribe(stations => this.stations = stations);
  }

  ngOnDestroy() {
    if (this.nameSearchSub) { this.nameSearchSub.unsubscribe(); }
    if (this.tagSearchSub) { this.tagSearchSub.unsubscribe(); }
  }

  onRowClicked(rbStation: RadioBrowserStation) {
    const station = new Station(rbStation.name, rbStation.url, null, rbStation.favicon, rbStation.tags);
    this.playerService.playStation(station);
  }
}
