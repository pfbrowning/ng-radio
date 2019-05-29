import { Observable, of, ReplaySubject } from 'rxjs';
import { Resolve } from '@angular/router';
import { take } from 'rxjs/operators';
import { ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

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

export function getElementBySelector<ComponentType>(fixture: ComponentFixture<ComponentType>, selector: string): any {
    const debugElement = fixture.debugElement.query(By.css(selector));
    return debugElement != null ? debugElement.nativeElement : null;
}

export function getElementTextBySelector<ComponentType>(fixture: ComponentFixture<ComponentType>, selector: string): string {
    const nativeElement = getElementBySelector<ComponentType>(fixture, selector);
    return nativeElement != null ? nativeElement.innerText : null;
}