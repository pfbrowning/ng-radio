import { Observable, of, ReplaySubject } from 'rxjs';
import { Resolve } from '@angular/router';
import { take } from 'rxjs/operators';

export class ActivatedRouteStub {
    private _data: object;
    public setData(data: object) {
        this._data = data;
    }
    public get data(): Observable<object> {
        return of(this._data);
    }
}

export class RouteResolverStub implements Resolve<Object> {
    public routeData = new ReplaySubject<Object>(1);
    public resolve(): Observable<Object> {
        return this.routeData.asObservable().pipe(take(1));
    }
}
