import { Injectable } from '@angular/core';
import { createEffect } from '@ngrx/effects';
import { map } from 'rxjs/operators';
import { WindowService } from '../../services/application/window.service';
import { ApplicationActions } from '.';

@Injectable()
export class ApplicationEffects {
  constructor(private windowService: WindowService) { }

  windowFocus$ = createEffect(() => this.windowService.focus.pipe(
    map(() => ApplicationActions.windowFocus())
  ));

  windowBlur$ = createEffect(() => this.windowService.blur.pipe(
    map(() => ApplicationActions.windowBlur())
  ));
}
