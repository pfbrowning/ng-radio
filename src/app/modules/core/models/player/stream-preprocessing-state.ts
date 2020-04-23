import { StreamPreprocessorFailureReason } from './stream-preprocessor-failure-reason';

export class StreamPreprocessingState {
    constructor(
        public readonly inProgress: boolean,
        public readonly validatedUrl: string,
        public readonly failureReason?: StreamPreprocessorFailureReason
    ) { }
}
