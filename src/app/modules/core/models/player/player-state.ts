import { Station } from './station';
import { PlayerStatus } from './player-status';
import { StreamInfo } from './stream-info';
import { StreamPreprocessingState } from './stream-preprocessing-state';

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
    checkedStreams: {
        [url: string]: StreamPreprocessingState;
    };
}
