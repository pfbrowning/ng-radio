import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, distinctUntilChanged, skip, withLatestFrom, filter, tap} from 'rxjs/operators';
import { StreamMetadataFacadeService } from './stream-metadata-facade.service';
import { isEqual } from 'lodash-es';
import { SocketIOService } from '../../services/socket-io.service';
import * as StreamMetadataActions from './actions';

@Injectable()
export class StreamMetadataEffects {
  constructor(
    private actions$: Actions,
    private streamMetadataFacade: StreamMetadataFacadeService,
    private socketIOService: SocketIOService
  ) { }

  setStreamList$ = createEffect(() => this.actions$.pipe(
    ofType(StreamMetadataActions.setStreamList),
    tap(({streams}) => this.socketIOService.emit('setStreams', streams))
  ), { dispatch: false });

  metadataReceived$ = createEffect(() => this.socketIOService.metadataReceived$.pipe(
    map(({url, title}) => StreamMetadataActions.metadataReceived({url, title}))
  ));

  setUrlsOnChanged$ = createEffect(() => this.streamMetadataFacade.urlsSelectedForMetadata$.pipe(
    distinctUntilChanged((x, y) => isEqual(x, y)),
    /* The initial value will be an empty array that we don't want to call the server about,
    but we do want to call the server about subsequent empty arrays, so skip is better than filter. */
    skip(1),
    map(streams => StreamMetadataActions.setStreamList({ streams }))
  ));

  // Re-send the url list upon re-connection in case of disconnects
  setUrlsOnSocketInit$ = createEffect(() => this.socketIOService.socketInitialized$.pipe(
    withLatestFrom(this.streamMetadataFacade.urlsSelectedForMetadata$),
    filter(([, urls]) => urls.length > 0),
    map(([, streams]) => StreamMetadataActions.setStreamList({ streams }))
  ));

  // Reconnect to Socket.IO if the server closed the connection while we're subscribed to (a) stream(s)
  reconnect$ = createEffect(() => this.socketIOService.serverDisconnect$.pipe(
    withLatestFrom(this.streamMetadataFacade.urlsSelectedForMetadata$),
    filter(([, urls]) => urls.length > 0),
    tap(() => this.socketIOService.connect())
  ), { dispatch: false });
}
