import { getElementBySelector } from './get-element-by-selector'
import { ComponentFixture } from '@angular/core/testing'

export function getElementTextBySelector<ComponentType>(
    fixture: ComponentFixture<ComponentType>,
    selector: string
): string {
    const nativeElement = getElementBySelector<ComponentType>(fixture, selector)
    return nativeElement != null ? nativeElement.innerText : null
}
