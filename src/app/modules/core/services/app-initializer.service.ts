import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { IntervalPingerService } from './interval-pinger.service';

@Injectable({ providedIn: 'root' })
export class AppInitializerService {
  constructor(private intervalPingerService: IntervalPingerService) {}

  public initialize = (): Observable<void> =>
    of(null).pipe(tap(() => this.onAppInitializerStarted()));

  private onAppInitializerStarted() {
    this.intervalPingerService.initialize();
  }
}
