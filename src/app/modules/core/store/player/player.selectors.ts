import { createSelector } from '@ngrx/store';
import { RootState } from '../../models/root-state';
import { StreamInfo } from '../../models/player/stream-info';

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

export const selectCurrentNowPlaying = createSelector(
    selectPlayerState,
    state => state.streamInfo.current.nowPlaying
);

export const selectCurrentStreamInfoStatus = createSelector(
    selectPlayerState,
    state => state.streamInfo.current.status
);

export const selectCurrentStationTitle = createSelector(
    selectCurrentStation,
    (station) => station != null ? station.title : null
);

export const selectCurrentStationAndNowPlaying = createSelector(
    selectCurrentStation,
    selectCurrentNowPlaying,
    (station, nowPlaying) => ({station, nowPlaying})
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

export const nowPlayingFetchInProgressUrls = createSelector(
    selectPlayerState,
    state => state.streamInfo.fetchInProgressUrls
)

export const nowPlayingIntervalInProgressUrls = createSelector(
    selectPlayerState,
    state => state.streamInfo.intervalInProgressUrls
)

export const currentUrlAndFetchInProgressUrls = createSelector(
    selectCurrentStationUrl,
    nowPlayingFetchInProgressUrls,
    (current, fetching) => ({current, fetching})
)

export const streamInfoUrls = createSelector(
    selectPlayerState,
    state => Object.keys(state.streamInfo.streams)
)

export const streamInfo = createSelector(
    selectPlayerState,
    streamInfoUrls,
    (state, urls) => new Map<string, StreamInfo>(urls.map(url => [url, state.streamInfo.streams[url]]))
)

export const nonIntervalOrFetchingStreamInfoUrls = createSelector(
    streamInfoUrls,
    nowPlayingFetchInProgressUrls,
    nowPlayingIntervalInProgressUrls,
    (urls, fetching, intervals) => urls.filter(u => !fetching.concat(intervals).includes(u))
)

export const currentAndStreamInfoUrls = createSelector(
    selectCurrentStationUrl,
    streamInfoUrls,
    (current, streamInfoUrls) => ({current, streamInfoUrls})
)

export const intervalCompletedParams = createSelector(
    selectCurrentStationUrl,
    streamInfoUrls,
    selectPlayerStatus,
    (current, listed, status) => ({current, listed, status})
)