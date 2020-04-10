import { PlayerState } from './player-state';
import { PlayerStatus } from './player-status';
import { StreamInfoStatus } from './stream-info-status';
import { StreamValidityState } from './stream-validity-state';

export const initialPlayerState: PlayerState = {
    currentStation: null,
    playerStatus: PlayerStatus.Stopped,
    streamInfo: null,
    streamInfoStatus: StreamInfoStatus.NotInitialized,
    validatedStreams: new Map<string, StreamValidityState>()
};
