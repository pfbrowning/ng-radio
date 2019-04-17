import { EventEmitter } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

/** AudioElement Testing Stub */
export class AudioElementStub {
    public error = new EventEmitter<any>();
    public source: string;

    private _paused = new BehaviorSubject<boolean>(true);
    public paused = this._paused.asObservable();

    public play(): void {
        this._paused.next(false);
    }

    public pause(): void {
        this._paused.next(true);
    }
}
