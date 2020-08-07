import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, switchMap, catchError, concatMap, debounceTime} from 'rxjs/operators';
import { of } from 'rxjs';
import { StreamMetadataService } from '@core/services';
import { StreamMetadataFacadeService } from './stream-metadata-facade.service';
import * as StreamMetadataActions from './actions';

@Injectable()
export class StreamMetadataEffects {
  constructor(
    private actions$: Actions,
    private streamMetadataService: StreamMetadataService,
    private streamMetadataFacade: StreamMetadataFacadeService
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

  setStreamList$ = createEffect(() => this.streamMetadataFacade.urlsSelectedForMetadata$.pipe(
    debounceTime(250),
    map(streams => StreamMetadataActions.setStreamListStart({ streams }))
  ));
}
