import { Injectable, NgZone } from '@angular/core';
import { Subject, Observable, from } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AudioElementService {
    private readonly audio: HTMLAudioElement = new Audio();

    constructor(private ngZone: NgZone) {
        this.audio.onerror = error => this.onError(error);
        this.audio.onpause = () => this.onPaused();
        this.audio.preload = 'none';
    }

    private errorSource = new Subject<any>();
    private pausedSource = new Subject<void>();

    public paused$ = this.pausedSource.asObservable();
    public error$ = this.errorSource.asObservable();

    public set src(value: string) {
        this.audio.src = value;
    }

    public play(): Observable<void> {
        return from(this.audio.play());
    }

    public pause(): void {
        this.audio.pause();
    }

    public set muted(value: boolean) {
        this.audio.muted = value;
    }

    private onError(error: any) {
        this.ngZone.run(() => this.errorSource.next(error));
    }

    private onPaused() {
        /* We have to explicitly dispatch this within the Angular zone in order for change detection
    to work properly because the HTML5 audio element which the event originated from was not in
    the Angular Zone. */
        this.ngZone.run(() => this.pausedSource.next());
    }
}
