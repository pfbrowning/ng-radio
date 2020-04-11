import { Injectable } from '@angular/core';
import { Observable, throwError, of } from 'rxjs';
import { map, switchMap, catchError, tap } from 'rxjs/operators';
import { StreamValidationFailureReason } from '../../models/player/stream-validation-failure-reason';
import { TryPlayStreamService } from './try-play-stream.service';
import { PlaylistReaderService } from './playlist-reader.service';
import isBlank from 'is-blank';

@Injectable({providedIn: 'root'})
export class StreamValidatorService {
  constructor(
    private tryPlayStreamService: TryPlayStreamService,
    private playlistReaderService: PlaylistReaderService
  ) { }

  public validateStream(streamUrl: string): Observable<string> {
    // First read the playlist if it's a pls, m3u, or m3u8
    return this.readPlaylistIfNecessary(streamUrl).pipe(
      // Attempt to load the provided or playlist-read stream
      switchMap(postPlaylistUrl => this.tryPlayStreamService.queueStreamForTryPlay(postPlaylistUrl)
        .pipe(map(tryPlayResult => ({postPlaylistUrl, tryPlayResult})))
      ),
      switchMap(({tryPlayResult, postPlaylistUrl}) => {
        if (tryPlayResult.success) {
          /* If the provided stream is insecure, then check to see if there's
          a corresponding valid HTTPS stream to upgrade to. */
          if (postPlaylistUrl.startsWith('http://')) {
            const retryUrl = postPlaylistUrl.replace('http://', 'https://');
            return this.tryPlayStreamService.queueStreamForTryPlay(retryUrl).pipe(
              map(retryResult => retryResult.success ? retryUrl : postPlaylistUrl)
            );
          }
          return of(postPlaylistUrl);
        } else {
          /* If the stream fails and it doesn't end in '/;', then append it and
          try again in order to see if it's a Shoutcast URL that needs to be forced
          into stream mode override. */
          let retryUrl = null;
          if (postPlaylistUrl.endsWith('/;')) {
            // Don't retry
          } else if (postPlaylistUrl.endsWith('/')) {
            retryUrl = `${postPlaylistUrl};`;
          } else {
            retryUrl = `${postPlaylistUrl}/;`;
          }
          if (retryUrl != null) {
            return this.tryPlayStreamService.queueStreamForTryPlay(retryUrl).pipe(
              switchMap(retryResult => {
                if (retryResult.success) {
                  return of(retryUrl);
                } else {
                  return throwError({
                    streamUrl,
                    postPlaylistUrl,
                    retryUrl,
                    error: tryPlayResult.error,
                    retryError: retryResult.error,
                    reason: StreamValidationFailureReason.ShoutcastRetryFailed
                  });
                }
              })
            );
          }
          // If it failed in spite of ending in "/;", then throw an error without attempting to retry
          return throwError({
            streamUrl,
            error: tryPlayResult.error,
            reason: StreamValidationFailureReason.FailedToLoadStream
          });
        }
      })
    )
  }

  private readPlaylistIfNecessary(streamUrl: string): Observable<string> {
    if(streamUrl.endsWith('.pls')) {
      return this.playlistReaderService.readPls(streamUrl).pipe(
        switchMap(response => isBlank(response) ? throwError("Couldn't process pls file") : of(response)),
        catchError(error => throwError({
          streamUrl,
          error,
          reason: StreamValidationFailureReason.FailedToLoadPls
        }))
      )
    }
    if (streamUrl.endsWith('.m3u') || streamUrl.endsWith('m3u8')) {
      return this.playlistReaderService.readM3uLike(streamUrl).pipe(
        switchMap(response => isBlank(response) ? throwError("Couldn't process m3u-like file") : of(response)),
        catchError(error => throwError({
          streamUrl,
          error,
          reason: StreamValidationFailureReason.FailedToLoadM3uLike
        }))
      )
    }
    return of(streamUrl);
  }
}
