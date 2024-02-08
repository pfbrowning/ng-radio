import { createAction, props } from '@ngrx/store';

export enum StreamMetadataActions {
  SetStreamList = '[Stream Metadata] Set Stream List',
  MetadataReceived = '[Stream Metadata] Metadata Received',
}

export const setStreamList = createAction(
  StreamMetadataActions.SetStreamList,
  props<{ streams: string[] }>()
);
