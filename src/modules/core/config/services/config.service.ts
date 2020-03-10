import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap, catchError, map } from 'rxjs/operators';
import { ReplaySubject, forkJoin, EMPTY, throwError, of, Observable } from 'rxjs';
import { IAppConfig } from '../models/app-config';
import { merge } from 'lodash';
import { environment } from '../../../../environments/environment';

/** Abstraction layer for configuration.  Fetches any necessary configuration files
 * before the app bootstraps and then stores the corresponding config info to be
 * injected by anybody who needs it. */
@Injectable()
export class ConfigService {
  constructor(private httpClient: HttpClient) {}

  private _initialized = false;
  private _initializationError: any = null;
  private _appConfig: IAppConfig;
  private loaded = new ReplaySubject<IAppConfig>(1);
  public loaded$ = this.loaded.asObservable();

  /** Public accessor for app config */
  public get appConfig(): IAppConfig {
    return this._appConfig;
  }

  /** Tells whether the config data was successfully fetched */
  public get initialized(): boolean {
    return this._initialized;
  }

  /** Public accessor for initialization error so that the
   * error can be properly logged and displayed on app
   * bootstrap */
  public get initializationError(): any {
    return this._initializationError;
  }

  /** Initializer function used by APP_INITIALIZER to
   * retrieve app config before app bootstrap */
  public initialize(): Observable<IAppConfig>{
    // Fetch and store the config
    return forkJoin([
      // Always load the regular app.config.json
      this.httpClient.get<IAppConfig>('/assets/config/app.config.json'),
      // If we're not in prod mode, attempt to load a local configuration
      environment.production ? of(null) : this.httpClient.get<IAppConfig>('/assets/config/local.config.json').pipe(
        catchError(error => {
          // If local config doesn't exist, then continue silently.  This isn't an error condition. 
          if(error.status === 404) {
            return of(null);
          }
          // If localconfig fails for some reason other than 404, then that is an error.
          return throwError(error);
        })        
      )
    ]).pipe(
      // Use lodash to deep merge local config into app config
      map(forkData => merge({}, forkData[0], forkData[1])),
      tap(config => {
        this._appConfig = config;
        this._initialized = true;
        this.loaded.next(config);
      }),
      catchError(error => {
        this._initializationError = error;
        this._initialized = false;
        return EMPTY;
      })
    )
  }
}
