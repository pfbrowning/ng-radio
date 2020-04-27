import { createSelector } from '@ngrx/store';
import { RootState } from '../../models/root-state';
import { StreamInfo } from '../../models/player/stream-info';
import { ApplicationSelectors } from '../application/.';

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

export const currentStreamInfo = createSelector(
    selectPlayerState,
    state => state.streamInfo.current
);

export const currentNowPlaying = createSelector(
    currentStreamInfo,
    current => current.nowPlaying
);

export const selectCurrentStationTitle = createSelector(
    selectCurrentStation,
    station => station && station.title
);

export const currentStationAndNowPlaying = createSelector(
    selectCurrentStation,
    currentNowPlaying,
    (station, nowPlaying) => ({station, nowPlaying})
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

export const nowPlayingFetchInProgressUrls = createSelector(
    selectPlayerState,
    state => state.streamInfo.fetchInProgressUrls
);

export const nowPlayingIntervalInProgressUrls = createSelector(
    selectPlayerState,
    state => state.streamInfo.intervalInProgressUrls
);

export const currentUrlAndFetchInProgressUrls = createSelector(
    selectCurrentStationUrl,
    nowPlayingFetchInProgressUrls,
    (current, fetching) => ({current, fetching})
);

export const streamInfoUrls = createSelector(
    selectPlayerState,
    state => Object.keys(state.streamInfo.streams)
);

export const streamInfo = createSelector(
    selectPlayerState,
    streamInfoUrls,
    (state, urls) => new Map<string, StreamInfo>(urls.map(url => [url, state.streamInfo.streams[url]]))
);

export const nonIntervalOrFetchingStreamInfoUrls = createSelector(
    streamInfoUrls,
    nowPlayingFetchInProgressUrls,
    nowPlayingIntervalInProgressUrls,
    (urls, fetching, intervals) => urls.filter(u => !fetching.concat(intervals).includes(u))
);

export const fetchIntervalParams = createSelector(
    selectCurrentStationUrl,
    streamInfoUrls,
    selectPlayerStatus,
    ApplicationSelectors.windowHasFocus,
    (current, listed, status, focused) => ({current, listed, status, focused})
);
