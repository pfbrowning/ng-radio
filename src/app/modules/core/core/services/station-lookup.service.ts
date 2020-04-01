import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { ConfigService } from '@config';
import { Station } from '../models/player/station';
import isBlank from 'is-blank';

/** Service which searches for and retrieves station data from the radio browser
 * API and any relevant JSON files. */
@Injectable()
export class StationLookupService {
  constructor(private configService: ConfigService, private httpClient: HttpClient) {}

  /**
   * Searches the Radio Browser API for stations matching the provided name and / or title.
   * @param name Station name / title to search for
   * @param tag Station tag to search for
   * @param limit Max number of results to request from the radio browser API.  Defaults to 100.
   */
  public search(name: string = null, tag: string = null, limit: number = 100): Observable<Array<Station>> {
    let body = new HttpParams();
    // Add name param if it's not blank
    if (!isBlank(name)) {
      body = body.set('name', name);
    }
    // Add tag param if it's not blank
    if (!isBlank(tag)) {
      body = body.set('tag', tag);
    }
    // Limit the results based on the provided param
    body = body.set('limit', limit.toString());
    // Perform the search against the configured radioBrowserUrl
    return this.httpClient.post<Array<any>>(`${this.configService.appConfig.radioBrowserApiUrl}/stations/search`,
      body, { headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded') }).pipe(
        // Map the results to our own station format
        map(stations => stations.map(station => this.mapStation(station)))
      );
  }

  /**
   * Retrieves the 'Top Clicked' stations from the radio browser API
   * @param count Number of stations to request
   */
  public fetchTopClicked(count: number = 15): Observable<Array<Station>> {
    return this.httpClient.get<Array<any>>(`${this.configService.appConfig.radioBrowserApiUrl}/stations/topclick/${count}`).pipe(
      map(stations => stations.map(station => this.mapStation(station)))
    );
  }

  /**
   * Retrieves the 'Top Voted' stations from the Radio Browser API
   * @param count Number of stations to request
   */
  public fetchTopVoted(count: number = 15): Observable<Array<Station>> {
    return this.httpClient.get<Array<any>>(`${this.configService.appConfig.radioBrowserApiUrl}/stations/topvote/${count}`).pipe(
      map(stations => stations.map(station => this.mapStation(station)))
    );
  }

  /**
   * Maps the provided station result from Radio Browser API's station format
   * to our own Browninglogic Radio Station format.
   * @param station Station entry provided by the Radio Browser API
   */
  private mapStation(station: any) {
    // If a non-empty tags string was provided, then split it into an array by the comma delimiter
    const tags = !isBlank(station.tags) ? station.tags.split(',') : null;
    return new Station(null, station.name, station.url, null, station.favicon, tags);
  }

  /** Retrieves the 'Developer-Suggested' stations from the JSON file stored in 'assets' */
  public fetchDeveloperSuggestions(): Observable<Array<Station>> {
    return this.httpClient.get<Array<Station>>('/assets/data/suggested-stations.json');
  }
}
