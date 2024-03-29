import { Injectable } from '@angular/core';
import { filter, map, take } from 'rxjs';
import { RootState } from '@core';
import { Store } from '@ngrx/store';
import { ConfigSelectors } from '../../store/config/selectors';

@Injectable({
  providedIn: 'root',
})
export class ConfigProviderService {
  constructor(private store: Store<RootState>) {}

  private configState$ = this.store.select(ConfigSelectors.configState);

  public getConfigOnceLoaded = () =>
    this.configState$.pipe(
      filter(state => !state.fetchFailed && !state.fetchInProgress && state.appConfig != null),
      map(state => state.appConfig),
      take(1)
    );
}
