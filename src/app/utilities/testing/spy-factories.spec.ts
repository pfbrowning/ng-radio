import { ChangeDetectorRef } from '@angular/core';

export function createChangeDetectorRefSpy(): jasmine.SpyObj<
    ChangeDetectorRef
> {
    return jasmine.createSpyObj('changeDetectorRef', ['markForChanges']);
}
