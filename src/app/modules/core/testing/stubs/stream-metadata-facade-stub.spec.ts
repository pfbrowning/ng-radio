import { of, NEVER, Observable } from 'rxjs';

export class StreamMetadataFacadeStub {
    metadataForCurrentStation$: Observable<string> = NEVER;
}
