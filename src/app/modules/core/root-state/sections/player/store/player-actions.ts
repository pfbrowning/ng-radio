import { createAction, props } from '@ngrx/store';
import { Station } from '../models/station';
import { StreamInfo } from '../models/stream-info';

export enum PlayerActions {
    SelectStation = '[Radio Player] Select Station',
    PlayAudioStart = '[Radio Player] Play Audio Start',
    PlayAudioSucceeded = '[Radio Player] Play Audio Succeeded',
    PlayAudioFailed = '[Radio Player] Play Audio Failed',
    PauseAudioSubmit = '[Radio Player] Pause Audio Submit',
    AudioPaused = '[Radio Player] Audio Paused',
    FetchStreamInfoStart = '[Stream Info] Fetch Stream Info Start',
    FetchStreamInfoSucceeded = '[Stream Info] Fetch Stream Info Succeeded',
    FetchStreamInfoFailed = '[Stream Info] Fetch Stream Info Failed',
}

export const selectStation = createAction(
    PlayerActions.SelectStation,
    props<{ station: Station }>()
);

export const playAudioStart = createAction(
    PlayerActions.PlayAudioStart
);

export const playAudioSucceeded = createAction(
    PlayerActions.PlayAudioSucceeded
);

export const playAudioFailed = createAction(
    PlayerActions.PlayAudioFailed,
    props<{ error: any }>()
);

export const pauseAudioSubmit = createAction(
    PlayerActions.PauseAudioSubmit
);

export const audioPaused = createAction(
    PlayerActions.AudioPaused
);

export const fetchStreamInfoStart = createAction(
    PlayerActions.FetchStreamInfoStart,
    props<{ streamUrl: string }>()
);

export const fetchStreamInfoSucceeded = createAction(
    PlayerActions.FetchStreamInfoSucceeded,
    props<{ streamUrl: string, streamInfo: StreamInfo, streamInfoChanged: boolean }>()
);

export const fetchStreamInfoFailed = createAction(
    PlayerActions.FetchStreamInfoFailed,
    props<{ streamUrl: string, error: any }>()
);