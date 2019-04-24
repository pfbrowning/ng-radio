import { Observable, of } from 'rxjs';

export class ActivatedRouteStub {
    private _data: object;
    public setData(data: object) {
        this._data = data;
    }
    public get data(): Observable<object> {
        return of(this._data);
    }
}
