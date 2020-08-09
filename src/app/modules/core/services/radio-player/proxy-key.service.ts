import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '../config/config.service';
import { Observable } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class ProxyKeyService {
  constructor(private httpClient: HttpClient, private configService: ConfigService) { }

  public fetchNew(): Observable<string> {
    // TODO Can / should we be using a raw string, rather than JSON, for this API response?
    return this.configService.appConfig$.pipe(
      switchMap(config => this.httpClient.post(`${config.radioProxyUrl}/proxyKey`, null)),
      map(response => response['proxyKey'])
    )
  }
}
