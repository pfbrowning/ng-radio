import { Injectable } from '@angular/core';
import { AudioElementFactoryService } from './audio-element-factory.service';
import { Observable, throwError, of, Subject } from 'rxjs';
import { map, catchError, tap, switchMap, concatMap } from 'rxjs/operators';
import { StreamValidationFailureReason } from '../models/player/stream-validation-failure-reason';
import { StreamValidationError } from '../models/player/stream-validation-error';
import { AudioElement } from '../models/player/audio-element';
import { TryPlayStreamResult } from '../models/player/try-play-stream-result';

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

  private tryPlayQueueSource = new Subject<{streamUrl: string, completed: Subject<TryPlayStreamResult>}>();
  private audio: AudioElement;

  public validateStream(streamUrl: string): Observable<string> {
    // Try to play the regular stream as provided
    return this.queueStreamForTryPlay(streamUrl).pipe(
      switchMap(result => {
        if (result.success) {
          /* If the provided stream is insecure, then check to see if there's
          a corresponding valid HTTPS stream to upgrade to. */
          if (streamUrl.startsWith('http://')) {
            const retryUrl = streamUrl.replace('http://', 'https://');
            return this.queueStreamForTryPlay(retryUrl).pipe(
              map(retryResult => retryResult.success ? retryUrl : streamUrl)
            );
          }
          return of(streamUrl);
        } else {
          /* If the stream fails and it doesn't end in '/;', then append it and
          try again in order to see if it's a Shoutcast URL that needs to be forced
          into stream mode override. */
          let retryUrl = null;
          if (streamUrl.endsWith('/;')) {
            // Don't retry
          } else if (streamUrl.endsWith('/')) {
            retryUrl = `${streamUrl};`;
          } else {
            retryUrl = `${streamUrl}/;`;
          }
          if (retryUrl != null) {
            return this.queueStreamForTryPlay(retryUrl).pipe(
              switchMap(retryResult => {
                if (retryResult.success) {
                  return of(retryUrl);
                } else {
                  return throwError(
                    new StreamValidationError(streamUrl, result.error, StreamValidationFailureReason.ShoutcastRetryFailed)
                  );
                }
              })
            );
          }
          // If it failed in spite of ending in "/;", then throw an error without attempting to retry
          return throwError(new StreamValidationError(streamUrl, result.error, StreamValidationFailureReason.FailedToLoadStream));
        }
      }),
    );
  }

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
  private queueStreamForTryPlay(streamUrl: string): Observable<TryPlayStreamResult> {
    const completed = new Subject<TryPlayStreamResult>();

    return of(null).pipe(
      tap(() => this.tryPlayQueueSource.next({streamUrl, completed})),
      switchMap(() => completed),
    );
  }
}
