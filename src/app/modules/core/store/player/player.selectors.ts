import { createSelector } from '@ngrx/store';
import { RootState } from '../../models/root-state';

export const selectPlayerState = (state: RootState) => state.player;

export const selectCurrentStation = createSelector(
    selectPlayerState,
    (state) => state.currentStation
);

export const selectCurrentStationUrl = createSelector(
    selectCurrentStation,
    (station) => station != null ? station.url : null
);

export const selectIsStationSelected = createSelector(
    selectCurrentStation,
    (station) => station != null
);

export const selectPlayerStatus = createSelector(
    selectPlayerState,
    (state) => state.playerStatus
);

export const selectCurrentStationTitle = createSelector(
    selectCurrentStation,
    station => station && station.title
);

export const selectCheckedStreams = createSelector(
    selectPlayerState,
    state => state.checkedStreams
);

export const selectCurrentStationValidationState = createSelector(
    selectCurrentStationUrl,
    selectCheckedStreams,
    (current, checked) => checked[current]
);

export const selectCurrentStationUrlAndItsValidationState = createSelector(
    selectCurrentStationUrl,
    selectCurrentStationValidationState,
    (url, validationState) => ({url, validationState})
);

export const selectIsValidationInProgressForCurrentStation = createSelector(
    selectCurrentStationValidationState,
    vs => vs && vs.inProgress
);

export const streamsMappedToADifferentUrl = createSelector(
    selectCheckedStreams,
    (checked) => Object.keys(checked)
        .map(original => ({original, validated: checked[original].validatedUrl}))
        .filter(m => m.validated && m.original !== m.validated)
);
