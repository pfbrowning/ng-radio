import { StreamInfo } from './stream-info';
import { Station } from './station';
import { StreamInfoStatus } from './stream-info-status';

export class NowPlaying {
    constructor(
        public readonly station: Station,
        public readonly streamInfo: StreamInfo,
        public readonly streamInfoStatus: StreamInfoStatus
    ) {}
}
