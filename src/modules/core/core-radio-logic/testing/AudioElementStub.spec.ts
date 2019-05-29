import { EventEmitter } from '@angular/core';

/** AudioElement Testing Stub */
export class AudioElementStub {
    public error = new EventEmitter<any>();
    public playing = new EventEmitter<void>();
    public paused = new EventEmitter<void>();
    public source: string;

    public play(): void {
        this.playing.emit();
    }

    public pause(): void {
        this.paused.emit();
    }

    public playSpy = spyOn(this, 'play').and.callThrough();
    public pauseSpy = spyOn(this, 'pause').and.callThrough();
}
