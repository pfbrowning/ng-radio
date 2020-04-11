import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { map, catchError, tap, switchMap, concatMap } from 'rxjs/operators';
import { AudioElementFactoryService } from '../audio-element-factory.service';
import { TryPlayStreamResult } from '../../models/player/try-play-stream-result';
import { AudioElement } from '../../models/player/audio-element';

@Injectable({providedIn: 'root'})
export class TryPlayStreamService {
  constructor(audioElementFactoryService: AudioElementFactoryService) {
    /* The validator service gets its own audio element so that it can validate streams
    independently of the currently-playing audio. */
    this.audio = audioElementFactoryService.create();
    this.audio.muted = true;
    /* I only want to maintain one audio element for validation, so I'm queuing up try
    play operations to run sequentially. */
    this.tryPlayQueueSource
      .pipe(concatMap(source => this.tryPlayStream(source.streamUrl).pipe(
        tap(result => source.completed.next(result))
      )))
      .subscribe();
  }

  private tryPlayQueueSource = new Subject<{streamUrl: string, completed: Subject<TryPlayStreamResult>}>();
  private audio: AudioElement;

  /**
   * Attempts to open the specified audio stream and reports whether it was
   * successful, along with an error message if applicable.  This should only
   * be run sequentially because we're using a single audio element.
   * @param streamUrl The stream to try to open
   */
  private tryPlayStream(streamUrl: string): Observable<TryPlayStreamResult> {
    return of(null).pipe(
      // Set the stream URL and attempt to play
      tap(() => this.audio.src = streamUrl),
      switchMap(() => this.audio.play()),
      map(() => new TryPlayStreamResult(true)),
      catchError(err => of(new TryPlayStreamResult(false, err))),
      // Pause and unload the audio
      tap(() => {
        this.audio.pause();
        this.audio.src = '';
      }),
    );
  }

  /**
   * Queues a stream for sequential try play and waits for it to be validated
   * @param streamUrl The stream to try to open
   */
  public queueStreamForTryPlay(streamUrl: string): Observable<TryPlayStreamResult> {
    const completed = new Subject<TryPlayStreamResult>();

    return of(null).pipe(
      tap(() => this.tryPlayQueueSource.next({streamUrl, completed})),
      switchMap(() => completed),
    );
  }
}
