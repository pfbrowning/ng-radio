import { EventEmitter } from '@angular/core';

/** AudioElement Testing Stub */
export class AudioElementStub {
    public error = new EventEmitter<any>();
    public playing = new EventEmitter<void>();
    public paused = new EventEmitter<void>();
    public source: string;

    public playSpy = spyOn(AudioElementStub.prototype, 'play').and.callThrough();
    public pauseSpy = spyOn(AudioElementStub.prototype, 'pause').and.callThrough();

    public play(): void {
        this.playing.emit();
    }

    public pause(): void {
        this.paused.emit();
    }
}
