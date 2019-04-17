import { EventEmitter } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

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
}
