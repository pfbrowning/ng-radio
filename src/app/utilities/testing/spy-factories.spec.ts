import { ChangeDetectorRef } from '@angular/core';

export const createChangeDetectorRefSpy = () =>
  jasmine.createSpyObj<ChangeDetectorRef>('changeDetectorRef', ['markForCheck']);
