import { StreamValidationFailureReason } from './stream-validation-failure-reason';

export class StreamValidityState {
    constructor(
        public readonly inProgress: boolean,
        public readonly validatedUrl: string,
        public readonly failureReason: StreamValidationFailureReason
    ) { }
}
