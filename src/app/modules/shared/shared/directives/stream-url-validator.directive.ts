import { Directive, ChangeDetectorRef } from '@angular/core';
import { NG_ASYNC_VALIDATORS, AbstractControl, AsyncValidator } from '@angular/forms';
import { AudioElementService } from '@core/services';
import { timer } from 'rxjs';
import { tap, map, switchMap } from 'rxjs/operators';

@Directive({
  selector: '[blrStreamUrlValidator]',
  providers: [
    {
      provide: NG_ASYNC_VALIDATORS,
      useExisting: StreamUrlValidatorDirective,
      multi: true,
    },
    /* This directive needs its own instance of the validator & audio element so that we
    can validate a stream independent of the currently playing stream. */
    AudioElementService,
  ],
})
export class StreamUrlValidatorDirective implements AsyncValidator {
  constructor(
    private audioElementService: AudioElementService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  // Previous validate calls unsubscribe on new values so timer is sufficient (instead of debounce)
  validate = (control: AbstractControl) =>
    timer(400).pipe(
      switchMap(() => this.audioElementService.validate(control.value)),
      map(result => (result.success ? null : { invalidStream: true })),
      tap(() => this.changeDetectorRef.markForCheck())
    );
}
