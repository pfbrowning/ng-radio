import { Injectable } from '@angular/core';
import { Observable, filter, take } from 'rxjs';
import { AppConfig } from '../../models/config/app-config';
import { RootState } from '@core';
import { Store, select } from '@ngrx/store';
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
      take(1)
    );
}
