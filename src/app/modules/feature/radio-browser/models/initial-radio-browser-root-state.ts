import { RadioBrowserSearchRootState } from './radio-browser-root-state';
import { initialRadioBrowserSearchState } from './initial-radio-browser-state';
import { initialRootState } from '@core';

export const initialRadioBrowserRootState: RadioBrowserSearchRootState = {
    ...initialRootState,
    radioBrowser: initialRadioBrowserSearchState
};
