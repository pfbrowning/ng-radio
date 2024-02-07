import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, take, shareReplay } from 'rxjs/operators';
import { forkJoin, throwError, of, Observable, defer } from 'rxjs';
import { AppConfig } from '../../models/config/app-config';
import { merge } from 'lodash-es';
import { EnvironmentService } from './environment.service';

@Injectable({ providedIn: 'root' })
export class ConfigService {
  constructor(private httpClient: HttpClient, private environmentService: EnvironmentService) {}

  public fetch = (): Observable<{ appConfig: AppConfig; localConfig: AppConfig }> =>
    forkJoin([
      this.fetchAppConfig(),
      !this.environmentService.isProduction() ? this.fetchLocalConfig() : of(null),
    ]).pipe(map(forkData => ({ appConfig: forkData[0], localConfig: forkData[1] })));

  // Set headers to disable caching: We always want clients to fetch the latest config values
  private noCacheHeaders() {
    return new HttpHeaders({
      'Cache-Control': 'no-cache, no-store, must-revalidate, post-check=0, pre-check=0',
      Pragma: 'no-cache',
      Expires: '0',
    });
  }

  private fetchAppConfig(): Observable<AppConfig> {
    return this.httpClient.get<AppConfig>('/assets/config/app.config.json', {
      headers: this.noCacheHeaders(),
    });
  }

  private fetchLocalConfig(): Observable<AppConfig> {
    return this.httpClient
      .get<AppConfig>('/assets/config/local.config.json', {
        headers: this.noCacheHeaders(),
      })
      .pipe(
        catchError(error => {
          // If local config doesn't exist, then continue silently.  This isn't an error condition.
          if (error.status === 404) {
            return of(null);
          }
          // If localconfig fails for some reason other than 404, then that is an error.
          return throwError(error);
        })
      );
  }
}
