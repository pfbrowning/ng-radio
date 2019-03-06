import { EventEmitter } from '@angular/core';

/** AudioElement Testing Stub */
export class AudioElementStub {
    public error = new EventEmitter<any>();
    public paused = new EventEmitter<void>();
    public source: string;
    private _paused = true;

    public get isPaused(): boolean {
        return this._paused;
    }

    public play(): void {
        this._paused = false;
    }

    public pause(): void {
        this._paused = true;
        this.paused.emit();
    }
}
