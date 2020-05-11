import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { RootState } from '@core';
import { AuthenticationSelectors } from './modules/core/store/authentication';
import { RouterExtendedSelectors } from './modules/core/store/router-extended';

@Component({
  selector: 'blr-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  constructor(private store: Store<RootState>) {}

  public authInitialized$ = this.store.pipe(select(AuthenticationSelectors.isInitialized));
  public routeResolving$ = this.store.pipe(select(RouterExtendedSelectors.isResolving));
}
