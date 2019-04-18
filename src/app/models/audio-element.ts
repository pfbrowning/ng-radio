import { EventEmitter } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

/** Wrapper class around HTMLAudioElement for testability */
export class AudioElement {
    constructor(
        private readonly audio: HTMLAudioElement = new Audio()
    ) {
        this.audio.onerror = (error) => this.error.emit(error);
        this.audio.onplaying = () => this.playing.emit();
        this.audio.onpause = () => {
            this.paused.emit();
            /* Clear the src on the audio element in order
            to prevent the browser from continuing to download
            audio while paused. */
            this.audio.src = '';
        }
        this.audio.preload = 'none';
    }

    /* Maintain the audio source in a separate property
    so that we can clear it from the audio element on pause
    and then re-assign it on play. */
    private _source : string;
    public error = new EventEmitter<any>();
    public playing = new EventEmitter<void>();
    public paused = new EventEmitter<void>();

    public get source(): string {
        return this._source;
    }

    public set source(value: string) {
        this._source = value;
    }

    public play(): void {
        this.audio.src = this._source;
        this.audio.play();
    }

    public pause(): void {
        this.audio.pause();
    }
}
