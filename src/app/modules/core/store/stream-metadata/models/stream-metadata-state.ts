export interface StreamMetadataState {
    streams: {
        [url: string]: string;
    },
    connectionInProgressStreams: Array<string>,
    errorStateStreams: Array<string>
}
