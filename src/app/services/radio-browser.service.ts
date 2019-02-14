import { Injectable } from '@angular/core';
import { ConfigService } from './config.service';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { IRadioBrowserStation } from '../models/radio-browser-station';
import isBlank from 'is-blank';

@Injectable({providedIn: 'root'})
export class RadioBrowserService {
  constructor(private configService: ConfigService, private httpClient: HttpClient) {}

  public searchStations(name: string, tag: string): Observable<Array<IRadioBrowserStation>> {
    let body = new HttpParams();
    // Add name param if it's not blank
    if(!isBlank(name)) {
      body = body.set('name', name);
    }
    // Add tag param if it's not blank
    if(!isBlank(tag)) {
      body = body.set('tag', tag);
    }
    // Always limit to the first 100 results
    body = body.set('limit', '100');
    return this.httpClient.post<Array<IRadioBrowserStation>>(`${this.configService.appConfig.radioBrowserApiUrl}/stations/search`, 
      body.toString(), { headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded') });
  }
}