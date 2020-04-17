import { PlayerState } from './player-state';
import { PlayerStatus } from './player-status';
import { StreamValidityState } from './stream-validity-state';
import { StreamInfoStatus } from './stream-info-status';

export const initialPlayerState: PlayerState = {
    currentStation: null,
    playerStatus: PlayerStatus.Stopped,
    streamInfo: {
        current: {
            nowPlaying: null,
            status: StreamInfoStatus.NotInitialized
        },
        streams: {},
        intervalInProgressUrls: [],
        fetchInProgressUrls: []
    },
    validatedStreams: new Map<string, StreamValidityState>(),
};
