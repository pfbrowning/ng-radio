import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Station } from '../../models/player/station';
import { map, switchMap } from 'rxjs/operators';
import { ConfigProviderService } from '../config/config-provider.service';

@Injectable({ providedIn: 'root' })
export class FavoriteStationsService {
  constructor(private configProvider: ConfigProviderService, private httpClient: HttpClient) {}

  private stationsResource$ = this.configProvider
    .getConfigOnceLoaded()
    .pipe(map(config => `${config.favoriteStationsApiUrl}/userstations`));

  public fetchAll(): Observable<Station[]> {
    return this.stationsResource$.pipe(
      switchMap(baseUrl => this.httpClient.get<Station[]>(baseUrl))
    );
  }

  public addFavorite(station: Station): Observable<Station> {
    return this.stationsResource$.pipe(
      switchMap(baseUrl => this.httpClient.post<Station>(baseUrl, station))
    );
  }

  public updateFavorite(stationId: number, station: Station): Observable<Station> {
    return this.stationsResource$.pipe(
      switchMap(baseUrl => this.httpClient.put<Station>(`${baseUrl}/${stationId}`, station))
    );
  }

  public removeFavorite(stationId: number): Observable<void> {
    return this.stationsResource$.pipe(
      switchMap(baseUrl => this.httpClient.delete<void>(`${baseUrl}/${stationId}`))
    );
  }
}
