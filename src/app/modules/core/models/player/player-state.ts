import { Station } from './station';
import { PlayerStatus } from './player-status';
import { StreamValidityState } from './stream-validity-state';
import { StreamInfo } from './stream-info';

export interface PlayerState {
    currentStation: Station;
    playerStatus: PlayerStatus;
    streamInfo: {
        current: StreamInfo
        streams: {
            [name: string]: StreamInfo;
        }
        intervalInProgressUrls: string[];
        fetchInProgressUrls: string[];
    };
    validatedStreams: Map<string, StreamValidityState>;
}
