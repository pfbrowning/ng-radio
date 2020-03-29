import { PlayerState } from './player-state';
import { PlayerStatus } from './player-status';
import { StreamInfoStatus } from './stream-info-status';

export const initialPlayerState: PlayerState = {
    currentStation: null,
    playerStatus: PlayerStatus.Stopped,
    streamInfo: null,
    streamInfoStatus: StreamInfoStatus.NotInitialized
};
