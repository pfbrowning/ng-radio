import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { RootState } from '@core';
import { RouterExtendedSelectors } from './modules/core/store/router-extended';
import { AuthenticationFacadeService } from '@core/store';

@Component({
  selector: 'blr-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  constructor(
    private store: Store<RootState>,
    private authenticationFacade: AuthenticationFacadeService
  ) {}

  public authInitialized$ = this.authenticationFacade.initialized$;
  public routeResolving$ = this.store.pipe(select(RouterExtendedSelectors.isResolving));
}
