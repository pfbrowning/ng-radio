import { StreamValidationFailureReason } from './stream-validation-failure-reason';

export class StreamValidationError {
    constructor(
        public readonly streamUrl: string,
        public readonly error: any,
        public readonly failureReason: StreamValidationFailureReason
    ) {}
}
