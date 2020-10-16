import { createAction, props } from '@ngrx/store'
import { Station } from '@core/models/player'

export enum SuggestedStationsActions {
    EffectsInit = '[Suggested Stations] Effects Init',
    DeveloperSuggestedFetchStart = '[Suggested Stations] Developer Suggested Fetch Start',
    DeveloperSuggestedFetchSucceeded = '[Suggested Stations] Developer Suggested Fetch Succeeded',
    DeveloperSuggestedFetchFailed = '[Suggested Stations] Developer Suggested Fetch Failed',
    TopClickedFetchStart = '[Suggested Stations] Top Clicked Fetch Start',
    TopClickedFetchSucceeded = '[Suggested Stations] Top Clicked Fetch Succeeded',
    TopClickedFetchFailed = '[Suggested Stations] Top Clicked Fetch Failed',
    TopVotedFetchStart = '[Suggested Stations] Top Voted Fetch Start',
    TopVotedFetchSucceeded = '[Suggested Stations] Top Voted Fetch Succeeded',
    TopVotedFetchFailed = '[Suggested Stations] Top Voted Fetch Failed',
}

export const effectsInit = createAction(SuggestedStationsActions.EffectsInit)

export const developerSuggestedFetchStart = createAction(
    SuggestedStationsActions.DeveloperSuggestedFetchStart
)

export const developerSuggestedFetchSucceeded = createAction(
    SuggestedStationsActions.DeveloperSuggestedFetchSucceeded,
    props<{ stations: Station[] }>()
)

export const developerSuggestedFetchFailed = createAction(
    SuggestedStationsActions.DeveloperSuggestedFetchFailed,
    props<{ error: any }>()
)

export const topClickedFetchStart = createAction(
    SuggestedStationsActions.TopClickedFetchStart
)

export const topClickedFetchSucceeded = createAction(
    SuggestedStationsActions.TopClickedFetchSucceeded,
    props<{ stations: Station[] }>()
)

export const topClickedFetchFailed = createAction(
    SuggestedStationsActions.TopClickedFetchFailed,
    props<{ error: any }>()
)

export const topVotedFetchStart = createAction(
    SuggestedStationsActions.TopVotedFetchStart
)

export const topVotedFetchSucceeded = createAction(
    SuggestedStationsActions.TopVotedFetchSucceeded,
    props<{ stations: Station[] }>()
)

export const topVotedFetchFailed = createAction(
    SuggestedStationsActions.TopVotedFetchFailed,
    props<{ error: any }>()
)
