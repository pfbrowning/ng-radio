export class Station {
    constructor(
        public readonly title: string,
        public readonly url: string,
        public readonly genre: string = null,
        public readonly iconUrl: string = null,
        public readonly tags: Array<string> = null
    ) {}
}