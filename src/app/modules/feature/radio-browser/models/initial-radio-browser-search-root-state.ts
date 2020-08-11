import { RadioBrowserSearchRootState } from './radio-browser-sear-root-state';
import { initialRadioBrowserSearchState } from './initial-radio-browser-search-state';
import { initialRootState } from '@core';

export const initialRadioBrowserRootState: RadioBrowserSearchRootState = {
    ...initialRootState,
    radioBrowser: initialRadioBrowserSearchState
};
