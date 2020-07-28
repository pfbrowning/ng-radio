import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType, OnInitEffects } from '@ngrx/effects';
import { map, catchError, switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { Action, Store } from '@ngrx/store';
import { NotificationService, Severities, RadioBrowserService, ConfigService } from '@core';
import { SuggestedStationsRootState } from '../models/suggested-stations-root-state';
import { SuggestedStationsService } from '../services/suggested-stations.service';
import * as SuggestedStationsActions from './suggested-stations.actions';

@Injectable()
export class SuggestedStationsEffects implements OnInitEffects {
  onEffectsInit$ = createEffect(() => this.actions$.pipe(
    ofType(SuggestedStationsActions.effectsInit),
    switchMap(() => this.configService.appConfig$),
    switchMap(() => [
      SuggestedStationsActions.developerSuggestedFetchStart(),
      SuggestedStationsActions.topClickedFetchStart(),
      SuggestedStationsActions.topVotedFetchStart(),
    ])
  ));

  fetchDeveloperSuggested$ = createEffect(() => this.actions$.pipe(
    ofType(SuggestedStationsActions.developerSuggestedFetchStart),
    switchMap(() => this.suggestedStationsService.fetchDeveloperSuggestions().pipe(
      map(stations => SuggestedStationsActions.developerSuggestedFetchSucceeded({stations})),
      catchError(error => of(SuggestedStationsActions.developerSuggestedFetchFailed({error})))
    ))
  ));

  fetchTopClicked$ = createEffect(() => this.actions$.pipe(
    ofType(SuggestedStationsActions.topClickedFetchStart),
    switchMap(() => this.radioBrowserService.fetchTopClicked().pipe(
      map(stations => SuggestedStationsActions.topClickedFetchSucceeded({stations})),
      catchError(error => of(SuggestedStationsActions.topClickedFetchFailed({error})))
    ))
  ));

  fetchTopVoted$ = createEffect(() => this.actions$.pipe(
    ofType(SuggestedStationsActions.topVotedFetchStart),
    switchMap(() => this.radioBrowserService.fetchTopVoted().pipe(
      map(stations => SuggestedStationsActions.topVotedFetchSucceeded({stations})),
      catchError(error => of(SuggestedStationsActions.topVotedFetchFailed({error})))
    ))
  ));

  notifyDeveloperSuggestedFetchFailed$ = createEffect(() => this.actions$.pipe(
    ofType(SuggestedStationsActions.developerSuggestedFetchFailed),
    tap(() => this.notificationService.notify(Severities.Error, 'Failed To Fetch Developer Suggested'))
  ), { dispatch: false });

  notifyTopClickedFetchFailed$ = createEffect(() => this.actions$.pipe(
    ofType(SuggestedStationsActions.topClickedFetchFailed),
    tap(() => this.notificationService.notify(Severities.Error, 'Failed To Fetch Top Clicked'))
  ), { dispatch: false });

  notifyTopVotedFailed$ = createEffect(() => this.actions$.pipe(
    ofType(SuggestedStationsActions.topVotedFetchFailed),
    tap(() => this.notificationService.notify(Severities.Error, 'Failed To Fetch Top Voted'))
  ), { dispatch: false });

  ngrxOnInitEffects(): Action {
    return SuggestedStationsActions.effectsInit();
  }

  constructor(
    private actions$: Actions,
    private store: Store<SuggestedStationsRootState>,
    private configService: ConfigService,
    private suggestedStationsService: SuggestedStationsService,
    private radioBrowserService: RadioBrowserService,
    private notificationService: NotificationService
  ) {}
}
