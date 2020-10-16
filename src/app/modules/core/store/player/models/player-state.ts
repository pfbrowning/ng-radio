import { Station } from '../../../models/player/station';
import { PlayerStatus } from '../../../models/player/player-status';

export interface PlayerState {
    currentStation: Station;
    playerStatus: PlayerStatus;
}
