import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { ConfigService } from '@core/services';

@Injectable({providedIn: 'root'})
export class PlaylistReaderService {
  constructor(private httpClient: HttpClient, private configService: ConfigService) { }

  private corsProxyUrl$ = this.configService.appConfig$.pipe(map(config => config.corsProxyUrl));

  public readPls(streamUrl): Observable<string> {
    return this.corsProxyUrl$.pipe(
      switchMap(proxyUrl => this.httpClient.get(`${proxyUrl}/${streamUrl}`, { responseType: 'text'})),
      map(pls => pls
        .split('\r\n')
        .find(l => l.startsWith('File1='))
        .substring('File1='.length)
      )
    );
  }

  public readM3uLike(streamUrl): Observable<string> {
    return this.corsProxyUrl$.pipe(
      switchMap(proxyUrl => this.httpClient.get(`${proxyUrl}/${streamUrl}`, { responseType: 'text'})),
      map(pls => pls
        .split('\n')
        .find(l => l.startsWith('http://') || l.startsWith('https://'))
      )
    );
  }
}
