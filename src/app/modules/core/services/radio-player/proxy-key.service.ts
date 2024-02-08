import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ConfigProviderService } from '../config/config-provider.service';

@Injectable({ providedIn: 'root' })
export class ProxyKeyService {
  constructor(private httpClient: HttpClient, private configProvider: ConfigProviderService) {}

  public fetchNew(): Observable<string> {
    return this.configProvider.getConfigOnceLoaded().pipe(
      switchMap(config =>
        this.httpClient.post(`${config.radioProxyUrl}/proxyKey`, null, {
          responseType: 'text',
        })
      )
    );
  }
}
