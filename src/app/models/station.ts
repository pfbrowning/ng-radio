export class Station {
    constructor(
        public title: string = null,
        public url: string = null,
        public genre: string = null,
        public iconUrl: string = null,
        public tags: Array<string> = null
    ) {}
}
