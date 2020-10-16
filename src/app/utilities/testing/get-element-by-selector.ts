import { ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

export function getElementBySelector<ComponentType>(
    fixture: ComponentFixture<ComponentType>,
    selector: string
): any {
    const debugElement = fixture.debugElement.query(By.css(selector));
    return debugElement != null ? debugElement.nativeElement : null;
}
