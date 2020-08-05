import { Station } from './station';
import { PlayerStatus } from './player-status';
import { StreamPreprocessingState } from './stream-preprocessing-state';

export interface PlayerState {
    currentStation: Station;
    playerStatus: PlayerStatus;
    checkedStreams: {
        [url: string]: StreamPreprocessingState;
    };
}
