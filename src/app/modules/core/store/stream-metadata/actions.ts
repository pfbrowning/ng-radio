import { createAction, props } from '@ngrx/store';

export enum StreamMetadataActions {
    SetStreamListStart = '[Stream Metadata] Set Stream List Start',
    SetStreamListSucceeded = '[Stream Metadata] Set Stream List Succeeded',
    SetStreamListFailed = '[Stream Metadata] Set Stream List Failed',
    MetadataReceived = '[Stream Metadata] Metadata Received',
}

export const setStreamListStart = createAction(
    StreamMetadataActions.SetStreamListStart,
    props<{ streams: Array<string> }>()
);

export const setStreamListSucceeded = createAction(
    StreamMetadataActions.SetStreamListSucceeded,
    props<{ streams: Array<string> }>()
);

export const setStreamListFailed = createAction(
    StreamMetadataActions.SetStreamListFailed,
    props<{ streams: Array<string>, error: any }>()
);

export const metadataReceived = createAction(
    StreamMetadataActions.MetadataReceived,
    props<{ url: string, title: string }>()
);