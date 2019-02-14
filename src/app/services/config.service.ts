import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { IAppConfig } from '../models/app-config';

@Injectable({providedIn: 'root'})
export class ConfigService {
  constructor(private httpClient: HttpClient) {}

  private _initialized: boolean = false;
  private _initializationError: any = null;
  private _appConfig: IAppConfig;

  public get appConfig(): IAppConfig {
    return this._appConfig;
  }

  public get initialized(): boolean {
    return this._initialized;
  }

  public get initializationError(): any {
    return this._initializationError;
  }

  public initialize(): Promise<boolean> {
    return this.httpClient.get<IAppConfig>('/assets/config/app.config.json').pipe(
      tap(appConfig => {
        this._appConfig = appConfig;
      })
    )
    .toPromise()
    .then(configs => {
      this._initialized = true;
      return true;
    })
    .catch(error => {
      this._initializationError = error;
      this._initialized = false;
      return false;
    });
  }
}