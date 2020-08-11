import { createAction, props } from '@ngrx/store';

export enum StreamMetadataActions {
    SetStreamList = '[Stream Metadata] Set Stream List',
    MetadataReceived = '[Stream Metadata] Metadata Received',
}

export const setStreamList = createAction(
    StreamMetadataActions.SetStreamList,
    props<{ streams: Array<string> }>()
);

export const metadataReceived = createAction(
    StreamMetadataActions.MetadataReceived,
    props<{ url: string, title: string }>()
);