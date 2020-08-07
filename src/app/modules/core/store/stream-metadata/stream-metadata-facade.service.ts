import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { RootState } from '../../models/root-state';
import { urlsSelectedForMetadata } from './selectors/urls-for-metadata.selector';
import { metadataForCurrentStation } from './selectors/player-metadata.selectors';
import * as Selectors from './selectors/selectors';

@Injectable({ providedIn: 'root' })
export class StreamMetadataFacadeService {
  public streamsMap$ = this.store.pipe(select(Selectors.streamsMap));
  public urlsSelectedForMetadata$ = this.store.pipe(select(urlsSelectedForMetadata));
  public metadataForCurrentStation$ = this.store.pipe(select(metadataForCurrentStation));

  constructor(private store: Store<RootState>) {}
}
