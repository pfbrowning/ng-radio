import * as fromRouter from '@ngrx/router-store';
import { RootState } from '../../models/root-state';

export const routerState = (state: RootState) => state.router;

export const currentUrl = fromRouter.getRouterSelectors(routerState).selectUrl;
