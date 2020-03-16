import { Injectable } from '@angular/core';
import { ConfigService } from '@modules/core/config/config.module';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Station } from '../models/station';
import { OAuthService } from 'angular-oauth2-oidc';
import { FavoriteStation } from '../models/favorite-station';

@Injectable({providedIn: 'root'})
export class FavoriteStationsService {
  constructor(private configService: ConfigService, private httpClient: HttpClient, private oauthService: OAuthService) {}

  private get stationsResource(): string {
    return `${this.configService.appConfig.favoriteStationsApiUrl}/userstations`;
  }

  public fetchAll(): Observable<Array<FavoriteStation>> {
    const headers = new HttpHeaders({'Authorization': `Bearer ${this.oauthService.getAccessToken()}`});
    return this.httpClient.get<Array<Station>>(this.stationsResource, { headers: headers });
  }
}
