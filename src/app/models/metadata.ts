export class Metadata {
    constructor(
        public title: string,
        public fetchsource: string,
        public stationTitle: string = null,
        public description: string = null,
        public genre: string = null,
        public bitrate: number = null,
    ) {}
}