import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { map, catchError, tap, switchMap, concatMap, timeout, take } from 'rxjs/operators';
import { ValidateStreamResult } from '../../models/player/validate-stream-result';
import { AudioElementService } from '../radio-player/audio-element.service';

@Injectable({providedIn: 'root'})
export class StreamValidatorService {
  constructor(private audioElementService: AudioElementService) {
    // Queue up try play operations to run sequentially because we only have one audio element.
    this.tryPlayQueueSource
      .pipe(concatMap(source => this.tryPlayStream(source.streamUrl).pipe(
        tap(result => source.completed.next(result))
      )))
      .subscribe();
  }

  private tryPlayQueueSource = new Subject<{streamUrl: string, completed: Subject<ValidateStreamResult>}>();
  private validStreams = new Array<string>();

  /**
   * Attempts to open the specified audio stream and reports whether it was
   * successful, along with an error message if applicable.  This should only
   * be run sequentially because we're using a single audio element.
   * @param streamUrl The stream to try to open
   */
  private tryPlayStream(streamUrl: string): Observable<ValidateStreamResult> {
    let previouslyMuted: boolean;
    return of(null).pipe(
      // Set the stream URL and attempt to play
      tap(() => {
        this.audioElementService.src = streamUrl;
        previouslyMuted = this.audioElementService.muted;
        this.audioElementService.muted = true;
      }),
      switchMap(() => this.audioElementService.play()),
      timeout(10000),
      map(() => new ValidateStreamResult(true)),
      catchError(err => of(new ValidateStreamResult(false, err))),
      // Pause and unload the audio
      tap(() => {
        this.audioElementService.pause();
        this.audioElementService.src = '';
        this.audioElementService.muted = previouslyMuted;
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
