export class AppError {
    constructor(
        public readonly error: any,
        public readonly comment: string
    ) {}
}
