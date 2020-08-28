import { PlayerState } from './player-state';
import { PlayerStatus } from './player-status';

export const initialPlayerState: PlayerState = {
    currentStation: null,
    playerStatus: PlayerStatus.Stopped,
    checkedStreams: {}
};
