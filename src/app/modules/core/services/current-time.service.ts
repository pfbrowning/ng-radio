import { Injectable } from '@angular/core';

@Injectable()
export class CurrentTimeService {

  public unix(): number {
    return Date.now();
  }
}
