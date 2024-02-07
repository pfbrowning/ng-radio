import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConfig } from '../../models/config/app-config';

@Injectable({
  providedIn: 'root',
})
export class ConfigProviderService {
  public getConfigOnceLoaded(): Observable<AppConfig> {
    throw new Error('Not implemented.  TODO take(1) on config once loaded.');
  }
}
