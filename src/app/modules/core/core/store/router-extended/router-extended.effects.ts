import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { tap } from 'rxjs/operators';
import { routerRequestAction, routerNavigatedAction, routerCancelAction, routerErrorAction } from '@ngrx/router-store';
import { LoadingIndicatorService } from '@browninglogic/ng-loading-indicator';

@Injectable()
export class RouterExtendedEffects {
  constructor(
    private actions$: Actions,
    private loadingIndicatorService: LoadingIndicatorService,
  ) {}

  showLoadingIndicator$ = createEffect(() => this.actions$.pipe(
    ofType(routerRequestAction),
    tap(() => this.loadingIndicatorService.showLoadingIndicator())
  ), { dispatch: false });

  hideLoadingIndicator$ = createEffect(() => this.actions$.pipe(
    ofType(routerNavigatedAction, routerCancelAction, routerErrorAction),
    tap(() => this.loadingIndicatorService.hideLoadingIndicator())
  ), { dispatch: false });
}
