import { createAction, props } from '@ngrx/store';
import { Station } from '@core/models/player';
import { Country } from '@core/models';

export enum RadioBrowserResultsActions {
    SearchSucceeded = '[Radio Browser API] Search Succeeded',
}

export const searchSucceeded = createAction(
    RadioBrowserResultsActions.SearchSucceeded,
    props<{ results: Station[] }>()
);
