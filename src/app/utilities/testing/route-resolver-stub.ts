import { Resolve } from '@angular/router';
import { ReplaySubject, Observable } from 'rxjs';
import { take } from 'rxjs/operators';

export class RouteResolverStub implements Resolve<Object> {
    public routeData = new ReplaySubject<Object>(1);
    public resolve(): Observable<Object> {
        return this.routeData.asObservable().pipe(take(1));
    }
}
