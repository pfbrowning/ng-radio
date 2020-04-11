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

export const selectStreamInfo = createSelector(
    selectPlayerState,
    (state) => state.streamInfo
);

export const selectIsStreamInfoPresent = createSelector(
    selectStreamInfo,
    (streamInfo) => streamInfo != null
);

export const selectStreamInfoStatus = createSelector(
    selectPlayerState,
    (state) => state.streamInfoStatus
);

export const selectCurrentStationTitle = createSelector(
    selectCurrentStation,
    (station) => station != null ? station.title : null
);

export const selectStreamInfoTitle = createSelector(
    selectStreamInfo,
    (streamInfo) => streamInfo != null ? streamInfo.title : null
);

export const selectCurrentStationUrlAndStreamInfo = createSelector(
    selectCurrentStationUrl,
    selectStreamInfo,
    (url, streamInfo) => ({url, streamInfo})
);

export const selectCurrentStationAndStreamInfo = createSelector(
    selectCurrentStation,
    selectStreamInfo,
    (station, streamInfo) => ({station, streamInfo})
);

export const selectValidatedStreams = createSelector(
    selectPlayerState,
    state => state.validatedStreams
);

export const selectCurrentStationValidationState = createSelector(
    selectCurrentStationUrl,
    selectValidatedStreams,
    (current, validatedStreams) => validatedStreams.get(current)
);

export const selectCurrentStationUrlAndItsValidationState = createSelector(
    selectCurrentStationUrl,
    selectCurrentStationValidationState,
    (url, validationState) => ({url, validationState})
);

export const selectIsValidationInProgressForCurrentStation = createSelector(
    selectCurrentStationValidationState,
    vs => vs != null && vs.inProgress
);
