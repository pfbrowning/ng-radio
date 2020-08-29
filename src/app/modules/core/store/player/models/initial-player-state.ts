import { PlayerState } from './player-state';
import { PlayerStatus } from '../../../models/player/player-status';

export const initialPlayerState: PlayerState = {
    currentStation: null,
    playerStatus: PlayerStatus.Stopped,
};
