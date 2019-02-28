export class RadioBrowserStation {
    constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly url: string,
        public readonly homepage: string,
        public readonly favicon: string,
        public readonly tags: Array<string>,
        public readonly country: string,
        public readonly language: string,
        public readonly bitrate: string
    ) {}
}
