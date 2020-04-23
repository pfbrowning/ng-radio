import { Injectable } from '@angular/core';
import { Observable, throwError, of } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';
import { TryPlayStreamService } from './try-play-stream.service';
import { PlaylistReaderService } from './playlist-reader.service';
import { StreamPreprocessorFailureReason } from '../../models/player/stream-preprocessor-failure-reason';
import isBlank from 'is-blank';

@Injectable({providedIn: 'root'})
export class StreamPreprocessorService {
  constructor(
    private tryPlayStreamService: TryPlayStreamService,
    private playlistReaderService: PlaylistReaderService
  ) { }

  public preprocessStream(streamUrl: string): Observable<string> {
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
                    reason: StreamPreprocessorFailureReason.ShoutcastRetryFailed
                  });
                }
              })
            );
          }
          // If it failed in spite of ending in "/;", then throw an error without attempting to retry
          return throwError({
            streamUrl,
            error: tryPlayResult.error,
            reason: StreamPreprocessorFailureReason.FailedToLoadStream
          });
        }
      })
    );
  }

  private readPlaylistIfNecessary(streamUrl: string): Observable<string> {
    // If we're reading a playlist file, omit any provided querystring
    const url = new URL(streamUrl);
    const originWithPath = url.origin + url.pathname;
    if (originWithPath.endsWith('.pls')) {
      return this.playlistReaderService.readPls(originWithPath).pipe(
        switchMap(response => isBlank(response) ? throwError('Couldn\'t process pls file') : of(response)),
        catchError(error => throwError({
          streamUrl,
          originWithPath,
          error,
          reason: StreamPreprocessorFailureReason.FailedToLoadPls
        }))
      );
    }
    if (originWithPath.endsWith('.m3u') || originWithPath.endsWith('m3u8')) {
      return this.playlistReaderService.readM3uLike(originWithPath).pipe(
        switchMap(response => isBlank(response) ? throwError('Couldn\'t process m3u-like file') : of(response)),
        catchError(error => throwError({
          streamUrl,
          originWithPath,
          error,
          reason: StreamPreprocessorFailureReason.FailedToLoadM3uLike
        }))
      );
    }
    return of(streamUrl);
  }
}
