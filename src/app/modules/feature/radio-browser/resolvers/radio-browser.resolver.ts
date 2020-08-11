import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { map, filter, take } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { RadioBrowserSearchRootState } from '../models/radio-browser-search-root-state';
import { resolverParams } from '../store/selectors';
import { resolveSubmit } from '../store/actions';

@Injectable({providedIn: 'root'})
export class RadioBrowserResolver implements Resolve<void> {
  constructor(private store: Store<RadioBrowserSearchRootState>) { }

  resolve(): Observable<void> {
    this.store.dispatch(resolveSubmit());
    return this.store.pipe(
        select(resolverParams),
        filter(selected => selected.countries != null || selected.failed),
        take(1),
        map(() => null)
    );
  }
}
