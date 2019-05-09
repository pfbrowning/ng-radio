import { Observable, Subject } from 'rxjs';
import { take } from 'rxjs/operators';
import { StreamInfo } from '@modules/core/core-radio-logic/core-radio-logic.module';

export class StreamInfoServiceStub {
    private metaSubject = new Subject<StreamInfo>();
    public getMetadataSpy = spyOn(this, 'getMetadata').and.callThrough();
    public flushMetadata(meta: StreamInfo) {
        this.metaSubject.next(meta);
    }
    public flushError(error: any) {
        this.metaSubject.error(error);
    }
    public getMetadata(url: string): Observable<StreamInfo> {
        return this.metaSubject.pipe(take(1));
    }
}
