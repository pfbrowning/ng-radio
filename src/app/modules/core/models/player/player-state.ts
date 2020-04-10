import { Station } from './station';
import { StreamInfo } from './stream-info';
import { StreamInfoStatus } from './stream-info-status';
import { PlayerStatus } from './player-status';
import { StreamValidityState } from './stream-validity-state';

export interface PlayerState {
    currentStation: Station;
    playerStatus: PlayerStatus;
    streamInfo: StreamInfo;
    streamInfoStatus: StreamInfoStatus;
    validatedStreams: Map<string, StreamValidityState>;
}
