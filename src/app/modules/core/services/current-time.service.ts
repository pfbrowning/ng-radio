import { Injectable } from '@angular/core';

@Injectable({providedIn: 'root'})
export class CurrentTimeService {
  /** The current unix timestamp in milliseconds */
  public unixMs(): number {
    return Date.now();
  }
}
