export class ValidateStreamResult {
    constructor(
        public readonly success: boolean,
        public readonly error?: any
    ) { }
}
