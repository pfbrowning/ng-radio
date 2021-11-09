import { ReplaySubject } from 'rxjs';

export class ToasterReadyStubService {
  public toasterReadySource = new ReplaySubject<void>(1);
  public toasterReady$ = this.toasterReadySource.asObservable();
}
