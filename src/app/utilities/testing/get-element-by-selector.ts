import { ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

export const getElementBySelector = <ComponentType>(
    fixture: ComponentFixture<ComponentType>,
    selector: string
) => {
    const debugElement = fixture.debugElement.query(By.css(selector));
    return debugElement != null ? debugElement.nativeElement : null;
};
