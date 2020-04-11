import { Injectable } from '@angular/core';
import { Observable, throwError, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { StreamValidationError } from '../../models/player/stream-validation-error';
import { StreamValidationFailureReason } from '../../models/player/stream-validation-failure-reason';
import { TryPlayStreamService } from './try-play-stream.service';

@Injectable({providedIn: 'root'})
export class StreamValidatorService {
  constructor(private tryPlayStreamService: TryPlayStreamService) { }

  public validateStream(streamUrl: string): Observable<string> {
    // Try to play the regular stream as provided
    return this.tryPlayStreamService.queueStreamForTryPlay(streamUrl).pipe(
      switchMap(result => {
        if (result.success) {
          /* If the provided stream is insecure, then check to see if there's
          a corresponding valid HTTPS stream to upgrade to. */
          if (streamUrl.startsWith('http://')) {
            const retryUrl = streamUrl.replace('http://', 'https://');
            return this.tryPlayStreamService.queueStreamForTryPlay(retryUrl).pipe(
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
            return this.tryPlayStreamService.queueStreamForTryPlay(retryUrl).pipe(
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
}
