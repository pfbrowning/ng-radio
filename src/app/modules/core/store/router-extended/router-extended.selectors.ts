import { createSelector } from '@ngrx/store';
import { RootState } from '../../models/root-state';

export const routerExtendedState = (state: RootState) => state.routerExtended;

export const isResolving = createSelector(
    routerExtendedState,
    state => state.resolving
);
