import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, take } from 'rxjs/operators';
import { MatInput } from '@angular/material/input';
import { Store, select } from '@ngrx/store';
import { selectStation } from '@core/store/player';
import { Station } from '@core/models/player';
import { nameTermUpdated, tagTermUpdated } from '../../store/radio-browser.actions';
import { SubSink } from 'subsink';
import { selectNameTerm, selectTagTerm, selectSearchResults, selectIsSearchInProgress } from '../../store/radio-browser.selectors';
import { RadioBrowserRootState } from '../../models/radio-browser-root-state';

@Component({
  templateUrl: './radio-browser.component.html',
  styleUrls: ['./radio-browser.component.scss']
})
export class RadioBrowserComponent implements OnInit, OnDestroy {
  constructor(private store: Store<RadioBrowserRootState>) {}

  @ViewChild('nameSearchInput', { static: true }) nameSearchInput: MatInput;

  public columns = ['name', 'tags', 'icon'];

  public searchResults$ = this.store.pipe(select(selectSearchResults));
  public isSearchInProgress$ = this.store.pipe(select(selectIsSearchInProgress));
  public nameSearch$ = new Subject<string>();
  public tagSearch$ = new Subject<string>();
  public nameSearch: string;
  public tagSearch: string;
  private debounceTime = 300;
  private subs = new SubSink();

  ngOnInit() {
    this.subs.sink = this.nameSearch$
      .pipe(debounceTime(this.debounceTime), distinctUntilChanged())
      .subscribe(term => this.store.dispatch(nameTermUpdated({term})));
    this.subs.sink = this.tagSearch$
      .pipe(debounceTime(this.debounceTime), distinctUntilChanged())
      .subscribe(term => this.store.dispatch(tagTermUpdated({term})));

    // Load any pre-existing terms from state on init
    this.store.pipe(select(selectNameTerm), take(1)).subscribe(term => this.nameSearch = term);
    this.store.pipe(select(selectTagTerm), take(1)).subscribe(term => this.tagSearch = term);

    // Focus on the name input
    this.nameSearchInput.focus();
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  onRowClicked(station: Station) {
    this.store.dispatch(selectStation({station}));
  }

  onTagTermChanged(term: string) {
    this.tagSearch$.next(term);
  }

  onNameTermChanged(term: string) {
    this.nameSearch$.next(term);
  }
}
