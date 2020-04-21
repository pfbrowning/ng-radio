import { Injectable } from '@angular/core';
import { ConfigService } from './config.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Station } from '../models/player/station';

@Injectable({providedIn: 'root'})
export class FavoriteStationsService {
  constructor(private configService: ConfigService, private httpClient: HttpClient) {}

  private get stationsResource(): string {
    return `${this.configService.appConfig.favoriteStationsApiUrl}/userstations`;
  }

  public fetchAll(): Observable<Station[]> {
    return this.httpClient.get<Station[]>(this.stationsResource);
  }

  public addFavorite(station: Station): Observable<Station> {
    return this.httpClient.post<Station>(this.stationsResource, station);
  }

  public updateFavorite(stationId: number, station: Station): Observable<Station> {
    return this.httpClient.put<Station>(`${this.stationsResource}/${stationId}`, station);
  }

  public removeFavorite(stationId: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.stationsResource}/${stationId}`);
  }
}
