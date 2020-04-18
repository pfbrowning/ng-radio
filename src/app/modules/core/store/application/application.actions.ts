import { createAction } from '@ngrx/store';

export enum ApplicationActions {
    WindowFocus = '[Application] Window Focus',
    WindowBlur = '[Application] Window Blur',
    ToasterInitialized = '[Application] Toaster Initialized',
}

export const windowFocus = createAction(
    ApplicationActions.WindowFocus
);

export const windowBlur = createAction(
    ApplicationActions.WindowBlur
);

export const toasterInitialized = createAction(
    ApplicationActions.ToasterInitialized
);
