import { NowPlaying } from './now-playing';
import { StreamInfoStatus } from './stream-info-status';

export interface StreamInfo {
    nowPlaying: NowPlaying;
    status: StreamInfoStatus
}
