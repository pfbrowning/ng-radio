import { Injectable } from '@angular/core'
import { select, Store } from '@ngrx/store'
import { RootState } from '../../models/root-state'
import { urlsSelectedForMetadata } from './selectors/urls-for-metadata.selector'
import * as PlayerMetadataSelectors from './selectors/player-metadata.selectors'

@Injectable({ providedIn: 'root' })
export class StreamMetadataFacadeService {
    public streamsMap$ = this.store.pipe(
        select(PlayerMetadataSelectors.streamsMap)
    )
    public urlsSelectedForMetadata$ = this.store.pipe(
        select(urlsSelectedForMetadata)
    )
    public metadataForCurrentStation$ = this.store.pipe(
        select(PlayerMetadataSelectors.metadataForCurrentStation)
    )

    constructor(private store: Store<RootState>) {}
}
