import { EventEmitter } from '@angular/core';

/** Wrapper class around HTMLAudioElement for testability */
export class AudioElement {
    constructor(
        private readonly audio: HTMLAudioElement = new Audio()
    ) {
        this.audio.onerror = (error) => this.error.emit(error);
        this.audio.onpause = () => this.paused.emit();
        this.audio.preload = 'none';
    }

    public error = new EventEmitter<any>();
    public paused = new EventEmitter<void>();

    public set src(value: string) {
        this.audio.src = value;
    }

    public play(): Promise<void> {
        return this.audio.play();
    }

    public pause(): void {
        this.audio.pause();
    }

    public set muted(value: boolean) {
        this.audio.muted = value;
    }
}
