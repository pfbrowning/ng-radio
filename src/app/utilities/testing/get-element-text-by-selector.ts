import { getElementBySelector } from './get-element-by-selector';
import { ComponentFixture } from '@angular/core/testing';

export const getElementTextBySelector = <ComponentType>(
  fixture: ComponentFixture<ComponentType>,
  selector: string
) => {
  const nativeElement = getElementBySelector<ComponentType>(fixture, selector);
  return nativeElement != null ? nativeElement.innerText : null;
};
