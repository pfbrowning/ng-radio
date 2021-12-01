import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { RadioProxyPingerService } from './radio-player/radio-proxy-pinger.service';

@Injectable({ providedIn: 'root' })
export class AppInitializerService {
  constructor(private radioProxyPinger: RadioProxyPingerService) {}

  public initialize = (): Observable<void> =>
    of(null).pipe(tap(() => this.onAppInitializerStarted()));

  private onAppInitializerStarted() {
    this.radioProxyPinger.initialize();
  }
}
