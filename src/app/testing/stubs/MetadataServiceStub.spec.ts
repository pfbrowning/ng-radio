import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { tap, map, timeout, take } from 'rxjs/operators';
import { Metadata } from 'src/app/models/metadata';

export class MetadataServiceStub {
    private metaSubject = new Subject<Metadata>();
    public getMetadataSpy = spyOn(this, 'getMetadata').and.callThrough();
    public flushMetadata(meta: Metadata) {
        this.metaSubject.next(meta);
    }
    public flushError(error: any) {
        this.metaSubject.error(error);
    }
    public getMetadata(url: string): Observable<Metadata> {
        return this.metaSubject.pipe(take(1));
    }
}
