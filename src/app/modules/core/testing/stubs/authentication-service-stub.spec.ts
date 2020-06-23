import { ReplaySubject } from 'rxjs';
import { take } from 'rxjs/operators';

export class AuthenticationServiceStub {
  public authenticatedSubject = new ReplaySubject<boolean>(1);

  public authenticated$ = this.authenticatedSubject.pipe(take(1));
}
