import { createAction, props } from '@ngrx/store';
import { Station } from '../../models/player/station';
import { StreamValidationFailureReason } from '../../models/player/stream-validation-failure-reason';
import { NowPlaying } from '../../models/player/now-playing';

export enum PlayerActions {
    SelectStation = '[Radio Player] Select Station',
    PlayAudioStart = '[Radio Player] Play Audio Start',
    PlayAudioSucceeded = '[Radio Player] Play Audio Succeeded',
    PlayAudioFailed = '[Radio Player] Play Audio Failed',
    PauseAudioSubmit = '[Radio Player] Pause Audio Submit',
    AudioPaused = '[Radio Player] Audio Paused',
    FetchNowPlayingStart = '[Stream Info] Fetch Now Playing Start',
    FetchNowPlayingSucceeded = '[Stream Info] Fetch Now Playing Succeeded',
    FetchNowPlayingFailed = '[Stream Info] Fetch Now Playing Failed',
    ValidateStreamSubmit = '[Radio Player] Validate Stream Submit',
    ValidateStreamStart = '[Radio Player] Validate Stream Start',
    ValidateStreamSucceeded = '[Radio Player] Validate Stream Succeeded',
    ValidateStreamFailed = '[Radio Player] Validate Stream Failed',
    SelectStreamInfoUrls = '[Radio Player] Select Stream Info Urls',
    ClearStreamInfoUrls = '[Radio Player] Clear Stream Info Urls',
    FetchIntervalStart = '[Radio Player] Fetch Interval Start',
    FetchIntervalCompleted = '[Radio Player] Fetch Interval Completed',
    CurrentNowPlayingChanged = '[Radio Player] Current Now Playing Changed'
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

export const fetchNowPlayingStart = createAction(
    PlayerActions.FetchNowPlayingStart,
    props<{ streamUrl: string }>()
);

export const fetchNowPlayingSucceeded = createAction(
    PlayerActions.FetchNowPlayingSucceeded,
    props<{ streamUrl: string, nowPlaying: NowPlaying }>()
);

export const fetchNowPlayingFailed = createAction(
    PlayerActions.FetchNowPlayingFailed,
    props<{ streamUrl: string, error: any }>()
);

export const validateStreamSubmit = createAction(
    PlayerActions.ValidateStreamSubmit,
    props<{ streamUrl: string }>()
);

export const validateStreamStart = createAction(
    PlayerActions.ValidateStreamStart,
    props<{ streamUrl: string }>()
);

export const validateStreamSucceeded = createAction(
    PlayerActions.ValidateStreamSucceeded,
    props<{ streamUrl: string, validatedUrl: string }>()
);

export const validateStreamFailed = createAction(
    PlayerActions.ValidateStreamFailed,
    props<{ streamUrl: string, reason: StreamValidationFailureReason, error: any, details: object }>()
);

export const selectStreamInfoUrls = createAction(
    PlayerActions.SelectStreamInfoUrls,
    props<{ streamUrls: Array<string> }>()
);

export const clearStreamInfoUrls = createAction(
    PlayerActions.ClearStreamInfoUrls
);

export const fetchIntervalStart = createAction(
    PlayerActions.FetchIntervalStart,
    props<{ streamUrl: string, duration: number }>()
);

export const fetchIntervalCompleted = createAction(
    PlayerActions.FetchIntervalCompleted,
    props<{ streamUrl: string }>()
);

export const currentNowPlayingChanged = createAction(
    PlayerActions.CurrentNowPlayingChanged,
    props<{ nowPlaying: NowPlaying }>()
)