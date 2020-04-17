import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, map, timeout } from 'rxjs/operators';
import { ConfigService } from './config.service';
import { NowPlaying } from '../models/player/now-playing';

/** Fetches "Now Playing" metadata for the specified radio URL from
 * the configured radio metadata API */
@Injectable()
export class StreamInfoService {
  constructor(
    private httpClient: HttpClient,
    private configService: ConfigService
  ) {}

  /* Keep track of the stream types returned from the metadata API
  so that we can pass them on subsequent calls.
  See the "StreamSource" section in the node-internet-radio readme:
  https://www.npmjs.com/package/node-internet-radio*/
  private streamTypes = new Map<string, string>();

  /**
   * Fetches the "Now Playing" metadata from the metadata API
   * https://github.com/pfbrowning/radio-metadata-api
   * @param url Stream URL to get the metadata for
   */
  public getMetadata(url: string): Observable<NowPlaying> {
    // Encode the URL before sending it via query param
    const encodedUrl = encodeURIComponent(url);
    let params = new HttpParams();
    params = params.append('url', encodedUrl);
    // If we already know the stream type, then add the 'method' querystring param
    if (this.streamTypes.has(encodedUrl)) {
      params = params.append('method', this.streamTypes.get(encodedUrl));
    }
    // GET now-playing data from the API
    return this.httpClient.get<any>(
      `${this.configService.appConfig.metadataApiUrl}/now-playing`,
      { params }).pipe(
        // Time out after a configured amount of time
        timeout(this.configService.appConfig.metadataFetchTimeout),
        /* Upon success, store the returned fetchsource so that we can pass it on for subsequent
        calls for the same URL. */
        tap(nowPlaying => this.streamTypes.set(encodedUrl, nowPlaying.fetchsource)),
        // Map the returned response to a cleaner metadata model
        map(response => {
          switch (response.fetchsource) {
            case 'STREAM':
              return new NowPlaying(response.title, response.fetchsource, response.headers['icy-br'],
                response.headers['icy-name'], response.headers['icy-description'], response.headers['icy-genre']);
            default:
              return new NowPlaying(response.title, response.fetchsource, response.bitrate);
          }
        })
    );
  }
}
