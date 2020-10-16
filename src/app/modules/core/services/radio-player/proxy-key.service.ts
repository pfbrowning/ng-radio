import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '../config/config.service';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class ProxyKeyService {
    constructor(
        private httpClient: HttpClient,
        private configService: ConfigService
    ) {}

    public fetchNew(): Observable<string> {
        return this.configService.appConfig$.pipe(
            switchMap(config =>
                this.httpClient.post(`${config.radioProxyUrl}/proxyKey`, null, {
                    responseType: 'text',
                })
            )
        );
    }
}
