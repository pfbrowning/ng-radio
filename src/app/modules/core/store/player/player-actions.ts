import { createAction, props } from '@ngrx/store';
import { Station } from '../../models/player/station';
import { StreamPreprocessorFailureReason } from '../../models/player/stream-preprocessor-failure-reason';

export enum PlayerActions {
    SelectStation = '[Radio Player] Select Station',
    PlayAudioStart = '[Radio Player] Play Audio Start',
    PlayAudioSucceeded = '[Radio Player] Play Audio Succeeded',
    PlayAudioFailed = '[Radio Player] Play Audio Failed',
    PauseAudioSubmit = '[Radio Player] Pause Audio Submit',
    AudioPaused = '[Radio Player] Audio Paused',
    PreprocessStreamStart = '[Radio Player] Preprocess Stream Start',
    PreprocessStreamSucceeded = '[Radio Player] Preprocess Stream Succeeded',
    PreprocessStreamFailed = '[Radio Player] Preprocess Stream Failed'
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
    props<{ station: Station, error: any }>()
);

export const pauseAudioSubmit = createAction(
    PlayerActions.PauseAudioSubmit
);

export const audioPaused = createAction(
    PlayerActions.AudioPaused
);

export const preprocessStreamStart = createAction(
    PlayerActions.PreprocessStreamStart,
    props<{ streamUrl: string }>()
);

export const preprocessStreamSucceeded = createAction(
    PlayerActions.PreprocessStreamSucceeded,
    props<{ streamUrl: string, validatedUrl: string }>()
);

export const preprocessStreamFailed = createAction(
    PlayerActions.PreprocessStreamFailed,
    props<{ streamUrl: string, reason: StreamPreprocessorFailureReason, error: any, details: object }>()
);