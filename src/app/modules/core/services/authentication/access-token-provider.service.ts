import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AccessTokenProviderService {
  constructor() {}

  public getAccessTokenOnceAuthenticated = (): Observable<string> => {
    throw new Error('TODO make me work please!');
  };
}
