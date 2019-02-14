import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, map, timeout } from 'rxjs/operators';
import { Metadata } from '../models/metadata';

@Injectable({providedIn: 'root'})
export class MetadataService {
  constructor(private httpClient: HttpClient) {}

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
  public getMetadata(url: string): Observable<Metadata> {
    // Encode the URL before sending it via query param
    let encodedUrl = encodeURIComponent(url);
    let params = new HttpParams();
    params = params.append('url', encodedUrl);
    // If we already know the stream type, then add the 'method' querystring param
    if(this.streamTypes.has(encodedUrl)) {
      params = params.append('method', this.streamTypes.get(encodedUrl));
    }
    // GET now-playing data from the API
    return this.httpClient.get<any>(`http://localhost:3000/now-playing`, {params: params}).pipe(
      // Time out after 15 seconds
      timeout(15000),
      /* Upon success, store the returned fetchsource so that we can pass it on for subsequent
      calls for the same URL. */
      tap(nowPlaying => this.streamTypes.set(encodedUrl, nowPlaying.fetchsource)),
      // Map the returned response to a cleaner metadata model
      map(response => {
        let bitrate : number = null;
        if(response.headers['icy-br'] != null) {
          bitrate = parseInt(response.headers['icy-br']);
        }
        return new Metadata(response.title, response.fetchsource, response.headers['icy-name'], 
          response.headers['icy-description'], response.headers['icy-genre'], bitrate);
      })
    );
  }
}
