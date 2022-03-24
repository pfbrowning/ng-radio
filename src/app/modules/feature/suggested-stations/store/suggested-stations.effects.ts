import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType, OnInitEffects } from '@ngrx/effects';
import { map, catchError, switchMap, tap, filter, take } from 'rxjs/operators';
import { of } from 'rxjs';
import { Action } from '@ngrx/store';
import { SuggestedStationsService } from '../services/suggested-stations.service';
import { NotificationsService, RadioBrowserService } from '@core/services';
import * as SuggestedStationsActions from './suggested-stations.actions';
import { AuthenticationFacadeService } from '@core/store';

@Injectable()
export class SuggestedStationsEffects implements OnInitEffects {
  onEffectsInit$ = createEffect(() =>
    this.authenticationFacade.authenticated$.pipe(
      take(1),
      filter(authenticated => authenticated),
      switchMap(() => [
        SuggestedStationsActions.developerSuggestedFetchStart(),
        SuggestedStationsActions.topClickedFetchStart(),
        SuggestedStationsActions.topVotedFetchStart(),
      ])
    )
  );

  fetchDeveloperSuggested$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SuggestedStationsActions.developerSuggestedFetchStart),
      switchMap(() =>
        this.suggestedStationsService.fetchDeveloperSuggestions().pipe(
          map(stations => SuggestedStationsActions.developerSuggestedFetchSucceeded({ stations })),
          catchError(error => of(SuggestedStationsActions.developerSuggestedFetchFailed({ error })))
        )
      )
    )
  );

  fetchTopClicked$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SuggestedStationsActions.topClickedFetchStart),
      switchMap(() =>
        this.radioBrowserService.fetchTopClicked().pipe(
          map(stations =>
            SuggestedStationsActions.topClickedFetchSucceeded({
              stations,
            })
          ),
          catchError(error =>
            of(
              SuggestedStationsActions.topClickedFetchFailed({
                error,
              })
            )
          )
        )
      )
    )
  );

  fetchTopVoted$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SuggestedStationsActions.topVotedFetchStart),
      switchMap(() =>
        this.radioBrowserService.fetchTopVoted().pipe(
          map(stations =>
            SuggestedStationsActions.topVotedFetchSucceeded({
              stations,
            })
          ),
          catchError(error =>
            of(
              SuggestedStationsActions.topVotedFetchFailed({
                error,
              })
            )
          )
        )
      )
    )
  );

  notifyDeveloperSuggestedFetchFailed$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(SuggestedStationsActions.developerSuggestedFetchFailed),
        tap(() => this.notificationsService.error('Failed To Fetch Developer Suggested'))
      ),
    { dispatch: false }
  );

  notifyTopClickedFetchFailed$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(SuggestedStationsActions.topClickedFetchFailed),
        tap(() => this.notificationsService.error('Failed To Fetch Top Clicked'))
      ),
    { dispatch: false }
  );

  notifyTopVotedFailed$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(SuggestedStationsActions.topVotedFetchFailed),
        tap(() => this.notificationsService.error('Failed To Fetch Top Voted'))
      ),
    { dispatch: false }
  );

  ngrxOnInitEffects(): Action {
    return SuggestedStationsActions.effectsInit();
  }

  constructor(
    private actions$: Actions,
    private suggestedStationsService: SuggestedStationsService,
    private radioBrowserService: RadioBrowserService,
    private notificationsService: NotificationsService,
    private authenticationFacade: AuthenticationFacadeService
  ) {}
}
