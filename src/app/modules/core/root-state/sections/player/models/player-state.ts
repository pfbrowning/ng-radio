import { Station, StreamInfo, StreamInfoStatus } from '@core';
import { PlayerStatus } from './player-status';

export interface PlayerState {
    currentStation: Station;
    playerStatus: PlayerStatus;
    streamInfo: StreamInfo;
    streamInfoStatus: StreamInfoStatus;
}
