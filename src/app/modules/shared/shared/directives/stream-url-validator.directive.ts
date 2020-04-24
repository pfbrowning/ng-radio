import { Directive, ChangeDetectorRef } from '@angular/core';
import { NG_ASYNC_VALIDATORS, ValidationErrors, AbstractControl, AsyncValidator } from '@angular/forms';
import { StreamValidatorService } from '@core';
import { Observable, timer } from 'rxjs';
import { tap, map, switchMap } from 'rxjs/operators';

@Directive({
  selector: '[blrStreamUrlValidator]',
  providers: [
    { provide: NG_ASYNC_VALIDATORS, useExisting: StreamUrlValidatorDirective, multi: true },
  ]
})
export class StreamUrlValidatorDirective implements AsyncValidator {
  constructor(private streamValidatorService: StreamValidatorService, private changeDetectorRef: ChangeDetectorRef) { }

  validate(control: AbstractControl): Observable<ValidationErrors|null> {
    // Previous validate calls unsubscribe on new values so timer is sufficient (instead of debounce)
    return timer(400).pipe(
      switchMap(() => this.streamValidatorService.validateStream(control.value)),
      map(result => result.success ?  null : {'invalidStream': true}),
      tap(() => this.changeDetectorRef.markForCheck())
    );
  }
}
