import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { IAppConfig } from '../models/app-config';
import { ReplaySubject } from 'rxjs';

/** Abstraction layer for configuration.  Fetches any necessary configuration files
 * before app bootstrap and then stores the corresponding config info to be injected
 * by anybody who needs it. */
@Injectable({providedIn: 'root'})
export class ConfigService {
  constructor(private httpClient: HttpClient) {}

  private _initialized = false;
  private _initializationError: any = null;
  private _appConfig: IAppConfig;
  private _loaded = new ReplaySubject<IAppConfig>(1);
  public loaded$ = this._loaded.asObservable();

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
  public initialize(): Promise<boolean> {
    // Fetch and store the config
    return this.httpClient.get<IAppConfig>('/assets/config/app.config.json').pipe(
      tap(appConfig => {
        this._appConfig = appConfig;
      })
    )
    /* Convert to promise simply because APP_INITIALIZER
    requires a promise. */
    .toPromise()
    .then(configs => {
      /* On success mark initialized as true so that app.component knows
      config intialization was successful. */
      this._initialized = true;
      this._loaded.next(this._appConfig);
      return true;
    })
    .catch(error => {
      /* On failure mark initialized as false and store the error
      so that it can be logged and shown by app.component in ngOnInit. */
      this._initializationError = error;
      this._initialized = false;
      return false;
    });
  }
}
