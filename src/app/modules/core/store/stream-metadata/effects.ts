import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, switchMap, catchError, concatMap, debounceTime, distinctUntilChanged} from 'rxjs/operators';
import { of } from 'rxjs';
import { StreamMetadataService } from '@core/services';
import { StreamMetadataFacadeService } from './stream-metadata-facade.service';
import { isEqual } from 'lodash-es';
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
    distinctUntilChanged((x, y) => isEqual(x, y)),
    map(streams => StreamMetadataActions.setStreamListStart({ streams }))
  ));
}
