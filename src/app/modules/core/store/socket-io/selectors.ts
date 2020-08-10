import { createSelector } from '@ngrx/store';
import { RootState } from '../../models/root-state';

export const socketIOState = (state: RootState) => state.socketIOState;

export const authenticated = createSelector(
    socketIOState,
    (state) => state.authenticated
)

export const connected = createSelector(
    socketIOState,
    (state) => state.connected
)