import { Injectable } from '@angular/core';
import { ConfigService } from './config.service';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { RadioBrowserStation } from '../models/radio-browser-station';
import isBlank from 'is-blank';
import { map } from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class RadioBrowserService {
  constructor(private configService: ConfigService, private httpClient: HttpClient) {}

  public searchStations(name: string, tag: string): Observable<Array<RadioBrowserStation>> {
    let body = new HttpParams();
    // Add name param if it's not blank
    if (!isBlank(name)) {
      body = body.set('name', name);
    }
    // Add tag param if it's not blank
    if (!isBlank(tag)) {
      body = body.set('tag', tag);
    }
    // Always limit to the first 100 results
    body = body.set('limit', '100');
    return this.httpClient.post<Array<any>>(`${this.configService.appConfig.radioBrowserApiUrl}/stations/search`,
      body.toString(), { headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded') }).pipe(
        map(stations => stations.map(station => {
          // If a non-empty tags string was provided, then split it into an array by the comma delimiter
          const tags = !isBlank(station.tags) ? station.tags.split(',') : null;
          return new RadioBrowserStation(station.id, station.name, station.url, station.homepage, station.favicon,
            tags, station.country, station.language, station.bitrate);
        }))
      );
  }
}
