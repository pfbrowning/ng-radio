import { EventEmitter } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

/** Wrapper class around HTMLAudioElement for testability */
export class AudioElement {
    constructor(
        private readonly audio: HTMLAudioElement = new Audio()
    ) {
        this.audio.onerror = (error) => this.error.emit(error);
        this.audio.onpause = () => this._paused.next(true);
        this.audio.onplaying = () => this._paused.next(false);
    }

    private _paused = new BehaviorSubject<boolean>(this.audio.paused);
    public error = new EventEmitter<any>();
    public paused = this._paused.asObservable();

    public get source(): string {
        return this.audio.src;
    }

    public set source(value: string) {
        this.audio.src = value;
    }

    public play(): void {
        this.audio.play();
    }

    public pause(): void {
        this.audio.pause();
    }
}
