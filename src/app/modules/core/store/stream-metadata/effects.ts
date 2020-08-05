import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, switchMap, catchError, concatMap} from 'rxjs/operators';
import { of } from 'rxjs';
import { StreamMetadataService } from '@core/services';
import * as StreamMetadataActions from './actions';

@Injectable()
export class StreamMetadataEffects {
  constructor(
    private actions$: Actions,
    private streamMetadataService: StreamMetadataService,
  ) { }

  connectToStreams$ = createEffect(() => this.actions$.pipe(
    ofType(StreamMetadataActions.setStreamListStart),
    switchMap(({streams}) => this.streamMetadataService.setConnectedStreams(streams).pipe(
      map(() => StreamMetadataActions.setStreamListSucceeded({streams})),
      catchError(error => of(StreamMetadataActions.setStreamListFailed({streams, error})))
    ))
  ));

  metadataReceived$ = createEffect(() => this.streamMetadataService.metadataReceived$.pipe(
    map(({url, title}) => StreamMetadataActions.metadataReceived({url, title}))
  ));

  /* TODO Write an effect which listens on the "all streams for metadata" selector's observable and
  maps that to a setStreamListStart action. */
}
