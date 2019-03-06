import { EventEmitter } from '@angular/core';

/** Wrapper class around HTMLAudioElement for testability */
export class AudioElement {
    constructor(
        private readonly audio: HTMLAudioElement = new Audio()
    ) {
        this.audio.onerror = (error) => this.error.emit(error);
        this.audio.onpause = () => this.paused.emit();
    }

    public error = new EventEmitter<any>();
    public paused = new EventEmitter<void>();

    public get source(): string {
        return this.audio.src;
    }

    public set source(value: string) {
        this.audio.src = value;
    }

    public get isPaused(): boolean {
      return this.audio.paused;
    }

    public play(): void {
        this.audio.play();
    }

    public pause(): void {
        this.audio.pause();
    }
}
