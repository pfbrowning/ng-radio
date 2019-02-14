export class Metadata {
    constructor(
        public readonly title: string,
        public readonly fetchsource: string,
        public readonly bitrate: string = null,
        public readonly stationTitle: string = null,
        public readonly description: string = null,
        public readonly genre: string = null
    ) {}
}