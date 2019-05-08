import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { ConfigService } from '@modules/config/config.module';
import { Station } from '../models/station';
import isBlank from 'is-blank';

@Injectable()
export class StationLookupService {
  constructor(private configService: ConfigService, private httpClient: HttpClient) {}

  public search(name: string, tag: string): Observable<Array<Station>> {
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
      body, { headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded') }).pipe(
        map(stations => stations.map(station => this.mapStation(station)))
      );
  }

  public getTopClicked(count: number = 15): Observable<Array<Station>> {
    return this.httpClient.get<Array<any>>(`${this.configService.appConfig.radioBrowserApiUrl}/stations/topclick/${count}`).pipe(
      map(stations => stations.map(station => this.mapStation(station)))
    );
  }

  public getTopVoted(count: number = 15): Observable<Array<Station>> {
    return this.httpClient.get<Array<any>>(`${this.configService.appConfig.radioBrowserApiUrl}/stations/topvote/${count}`).pipe(
      map(stations => stations.map(station => this.mapStation(station)))
    );
  }

  private mapStation(station: any) {
    // If a non-empty tags string was provided, then split it into an array by the comma delimiter
    const tags = !isBlank(station.tags) ? station.tags.split(',') : null;
    return new Station(station.name, station.url, null, station.favicon, tags);
  }

  public getDeveloperSuggestions(): Observable<Array<Station>> {
    return this.httpClient.get<Array<Station>>('/assets/data/suggested-stations.json');
  }
}
