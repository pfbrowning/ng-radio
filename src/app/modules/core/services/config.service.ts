import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tap, catchError, map } from 'rxjs/operators';
import { forkJoin, throwError, of, Observable } from 'rxjs';
import { AppConfig } from '../models/config/app-config';
import { environment } from '@environment';
import merge from 'lodash/merge';

/** Abstraction layer for configuration.  Fetches any necessary configuration files
 * before the app bootstraps and then stores the corresponding config info to be
 * injected by anybody who needs it. */
@Injectable()
export class ConfigService {
  constructor(private httpClient: HttpClient) {}

  private _appConfig: AppConfig;

  /** Public accessor for app config */
  public get appConfig(): AppConfig {
    return this._appConfig;
  }

  public fetch(): Observable<AppConfig> {
    // Set headers to disable caching: We always want clients to fetch the latest config values
    const headers = new HttpHeaders({
      'Cache-Control':  'no-cache, no-store, must-revalidate, post-check=0, pre-check=0',
      'Pragma': 'no-cache',
      'Expires': '0'
    });
    // Fetch and store the config
    return forkJoin([
      // Always load the regular app.config.json
      this.httpClient.get<AppConfig>('/assets/config/app.config.json', { headers }),
      // If we're not in prod mode, attempt to load a local configuration
      environment.production ? of(null) : this.httpClient.get<AppConfig>('/assets/config/local.config.json', { headers }).pipe(
        catchError(error => {
          // If local config doesn't exist, then continue silently.  This isn't an error condition.
          if (error.status === 404) {
            return of(null);
          }
          // If localconfig fails for some reason other than 404, then that is an error.
          return throwError(error);
        })
      )
    ]).pipe(
      // Use lodash to deep merge local config into app config
      map(forkData => merge({}, forkData[0], forkData[1])),
      tap(config => this._appConfig = config)
    );
  }
}
