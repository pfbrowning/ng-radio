import { Action, createReducer, on } from '@ngrx/store';
import { routerRequestAction, routerNavigatedAction, routerCancelAction, routerErrorAction } from '@ngrx/router-store';
import { RouterExtendedState } from '../../models/router-extended/router-extended-state';
import { initialRouterExtendedState } from '../../models/router-extended/initial-router-extended-state';

const reducer = createReducer(
  initialRouterExtendedState,
  on(routerRequestAction, state => ({
    ...state,
    resolving: true
  })),
  on(routerNavigatedAction, routerCancelAction, routerErrorAction, state => ({
    ...state,
    resolving: false
  })),
);

export function routerExtendedReducer(state: RouterExtendedState | undefined, action: Action) {
  return reducer(state, action);
}
