import { EventEmitter } from '@angular/core';

/** AudioElement Testing Stub */
export class AudioElementStub {
    public error$ = new EventEmitter<any>();
    public playing = new EventEmitter<void>();
    public paused$ = new EventEmitter<void>();
    public source: string;

    private playResolver: () => void;
    private playRejector: (error: any) => void;

    public pauseSpy = spyOn(
        AudioElementStub.prototype,
        'pause'
    ).and.callThrough();
    public playSpy = spyOn(
        AudioElementStub.prototype,
        'play'
    ).and.callThrough();

    public playResolve(): void {
        this.playResolver();
        this.playing.emit();
    }

    public playReject(error: any): void {
        this.playRejector(error);
    }

    public play(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.playResolver = resolve;
            this.playRejector = reject;
        });
    }

    public pause(): void {
        this.playResolver = null;
        this.playRejector = null;
        this.paused$.emit();
    }
}
