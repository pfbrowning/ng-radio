import { Injectable } from '@angular/core';
import { ConfigService } from '@config';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Station } from '../models/station';
import { OAuthService } from 'angular-oauth2-oidc';

@Injectable({providedIn: 'root'})
export class FavoriteStationsService {
  constructor(private configService: ConfigService, private httpClient: HttpClient, private oauthService: OAuthService) {}

  private get stationsResource(): string {
    return `${this.configService.appConfig.favoriteStationsApiUrl}/userstations`;
  }

  public fetchAll(): Observable<Array<Station>> {
    const headers = new HttpHeaders({'Authorization': `Bearer ${this.oauthService.getAccessToken()}`});
    return this.httpClient.get<Array<Station>>(this.stationsResource, { headers: headers });
  }

  public addFavorite(station: Station): Observable<Station> {
    const headers = new HttpHeaders({'Authorization': `Bearer ${this.oauthService.getAccessToken()}`});
    return this.httpClient.post<Station>(this.stationsResource, station, { headers: headers });
  }

  public removeFavorite(stationId: number): Observable<void> {
    const headers = new HttpHeaders({'Authorization': `Bearer ${this.oauthService.getAccessToken()}`});
    return this.httpClient.delete<void>(`${this.stationsResource}/${stationId}`, { headers: headers });
  }
}
