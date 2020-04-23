import { Action, createReducer, on } from '@ngrx/store';
import {
  selectStation,
  playAudioStart,
  playAudioSucceeded,
  playAudioFailed,
  audioPaused,
} from './player-actions';
import { initialPlayerState } from '../../models/player/initial-player-state';
import { StreamInfoStatus } from '../../models/player/stream-info-status';
import { PlayerStatus } from '../../models/player/player-status';
import { PlayerState } from '../../models/player/player-state';
import { PlayerActions } from './index';
import { StreamPreprocessingState } from '../../models/player/stream-preprocessing-state';

const reducer = createReducer(
  initialPlayerState,
  on(selectStation, (state, {station}) => ({
    ...state,
    streamInfo: {
      ...state.streamInfo,
      current: {
        ...state.streamInfo.current,
        nowPlaying: null,
        status: StreamInfoStatus.NotInitialized
      }
    },
    currentStation: station,
    playerStatus: PlayerStatus.Stopped
  })),
  on(playAudioStart, state => ({
    ...state,
    playerStatus: PlayerStatus.LoadingAudio
  })),
  on(playAudioSucceeded, state => ({
    ...state,
    playerStatus: PlayerStatus.Playing
  })),
  on(playAudioFailed, state => ({
    ...state,
    playerStatus: PlayerStatus.Stopped
  })),
  on(audioPaused, state => ({
    ...state,
    streamInfo: {
      ...state.streamInfo,
      current: {
        ...state.streamInfo.current,
        status: StreamInfoStatus.NotInitialized
      }
    },
    playerStatus: PlayerStatus.Stopped,
  })),
  on(PlayerActions.fetchNowPlayingStart, (state, {streamUrl}) => ({
    ...state,
    streamInfo: {
      ...state.streamInfo,
      current: {
        ...state.streamInfo.current,
        status: state.currentStation && state.currentStation.url === streamUrl
          ? StreamInfoStatus.LoadingStreamInfo
          : state.streamInfo.current.status
      },
      streams: state.streamInfo.streams[streamUrl] != null
        ? {
          ...state.streamInfo.streams,
          [streamUrl]: {
            ...state.streamInfo.streams[streamUrl],
            status: StreamInfoStatus.LoadingStreamInfo
          }
        }
        : state.streamInfo.streams,
      fetchInProgressUrls: state.streamInfo.fetchInProgressUrls.concat(streamUrl)
    }
  })),
  on(PlayerActions.fetchNowPlayingSucceeded, (state, {nowPlaying, streamUrl}) => ({
    ...state,
    streamInfo: {
      ...state.streamInfo,
      current: state.currentStation && state.currentStation.url === streamUrl
        ? {
          nowPlaying,
          status: StreamInfoStatus.Valid
        }
        : state.streamInfo.current,
      streams: state.streamInfo.streams[streamUrl] != null
        ? {
          ...state.streamInfo.streams,
          [streamUrl]: {
            nowPlaying,
            status: StreamInfoStatus.Valid
          }
        }
        : state.streamInfo.streams,
      fetchInProgressUrls: state.streamInfo.fetchInProgressUrls.filter(u => u !== streamUrl)
    }
  })),
  on(PlayerActions.fetchNowPlayingFailed, (state, {streamUrl}) => ({
    ...state,
    streamInfo: {
      ...state.streamInfo,
      current: state.currentStation && state.currentStation.url === streamUrl
        ? {
          ...state.streamInfo.current,
          nowPlaying: null,
          status: StreamInfoStatus.Error
        }
        : state.streamInfo.current,
      streams: state.streamInfo.streams[streamUrl] != null
        ? {
          ...state.streamInfo.streams,
          [streamUrl]: {
            nowPlaying: null,
            status: StreamInfoStatus.Error
          }
        }
        : state.streamInfo.streams,
      fetchInProgressUrls: state.streamInfo.fetchInProgressUrls.filter(u => u !== streamUrl)
    },
    streamInfoStatus: StreamInfoStatus.Error
  })),
  on(PlayerActions.preprocessStreamStart, (state, { streamUrl }) => ({
    ...state,
    checkedStreams: {
      ...state.checkedStreams,
      [streamUrl]: new StreamPreprocessingState(true, null, null)
    }
  })),
  on(PlayerActions.preprocessStreamSucceeded, (state, { streamUrl, validatedUrl }) => ({
    ...state,
    checkedStreams: {
      ...state.checkedStreams,
      [streamUrl]: new StreamPreprocessingState(false, validatedUrl, null),
      [validatedUrl]: new StreamPreprocessingState(false, validatedUrl, null)
    }
  })),
  on(PlayerActions.preprocessStreamFailed, (state, { streamUrl, reason }) => ({
    ...state,
    checkedStreams: {
      ...state.checkedStreams,
      [streamUrl]: new StreamPreprocessingState(false, null, reason)
    }
  })),
  on(PlayerActions.selectStreamInfoUrls, (state, { streamUrls }) => ({
    ...state,
    streamInfo: {
      ...state.streamInfo,
      streams: streamUrls.reduce((accumulator, current) => {
        const existing = state.currentStation && state.currentStation.url === current
          ? state.streamInfo.current
          : state.streamInfo.streams[current];
        accumulator[current] = existing != null
          ? {
            nowPlaying: existing.nowPlaying,
            status: existing.status
          }
          : {
            nowPlaying: null,
            status: StreamInfoStatus.NotInitialized
          };
        return accumulator;
      }, {})
    }
  })),
  on(PlayerActions.clearStreamInfoUrls, state => ({
    ...state,
    streamInfo: {
      ...state.streamInfo,
      streams: {},
      intervalInProgressUrls: []
    }
  })),
  on(PlayerActions.fetchIntervalStart, (state, {streamUrl}) => ({
    ...state,
    streamInfo: {
      ...state.streamInfo,
      intervalInProgressUrls: state.streamInfo.intervalInProgressUrls.concat(streamUrl)
    }
  })),
  on(PlayerActions.fetchIntervalCompleted, (state, {streamUrl}) => ({
    ...state,
    streamInfo: {
      ...state.streamInfo,
      intervalInProgressUrls: state.streamInfo.intervalInProgressUrls.filter(u => u !== streamUrl)
    }
  })),
);

export function playerReducer(state: PlayerState | undefined, action: Action) {
  return reducer(state, action);
}
