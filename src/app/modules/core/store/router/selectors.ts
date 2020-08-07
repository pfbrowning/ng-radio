import * as fromRouter from '@ngrx/router-store';
import { createSelector, createFeatureSelector } from '@ngrx/store';
import { RootState } from '../../models/root-state';

export const routerState = (state: RootState) => state.router;
 
export const currentUrl = fromRouter.getSelectors(routerState).selectUrl;