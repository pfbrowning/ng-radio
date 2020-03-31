import { RadioBrowserRootState } from './radio-browser-root-state';
import { initialRadioBrowserState } from './initial-radio-browser-state';
import { initialRootState } from '@core';

export const initialRadioBrowserRootState: RadioBrowserRootState = {
    ...initialRootState,
    radioBrowser: initialRadioBrowserState
};
