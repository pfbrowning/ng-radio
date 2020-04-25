import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { map, catchError, tap, switchMap, concatMap, timeout, take } from 'rxjs/operators';
import { AudioElementFactoryService } from '../audio-element-factory.service';
import { AudioElement } from '../../models/player/audio-element';
import { ValidateStreamResult } from '../../models/player/validate-stream-result';

@Injectable({providedIn: 'root'})
export class StreamValidatorService {
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

  private tryPlayQueueSource = new Subject<{streamUrl: string, completed: Subject<ValidateStreamResult>}>();
  private audio: AudioElement;
  private validStreams = new Array<string>();

  /**
   * Attempts to open the specified audio stream and reports whether it was
   * successful, along with an error message if applicable.  This should only
   * be run sequentially because we're using a single audio element.
   * @param streamUrl The stream to try to open
   */
  private tryPlayStream(streamUrl: string): Observable<ValidateStreamResult> {
    return of(null).pipe(
      // Set the stream URL and attempt to play
      tap(() => this.audio.src = streamUrl),
      switchMap(() => this.audio.play()),
      timeout(10000),
      map(() => new ValidateStreamResult(true)),
      catchError(err => of(new ValidateStreamResult(false, err))),
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
  private queueStreamForTryPlay(streamUrl: string): Observable<ValidateStreamResult> {
    const completed = new Subject<ValidateStreamResult>();

    return of(null).pipe(
      tap(() => this.tryPlayQueueSource.next({streamUrl, completed})),
      switchMap(() => completed),
    );
  }

  /**
   * Queues a stream for sequential try play if it hasn't already been successfully
   * validated, returns a success otherwise
   * @param streamUrl The stream to try to open
   */
  public validateStream(streamUrl: string): Observable<ValidateStreamResult> {
    if (this.validStreams.includes(streamUrl)) {
      return of(new ValidateStreamResult(true));
    }
    return this.queueStreamForTryPlay(streamUrl).pipe(take(1));
  }
}
