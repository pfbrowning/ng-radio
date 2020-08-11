import { RootState } from '@core';
import { RadioBrowserSearchState } from './radio-browser-state';

export interface RadioBrowserSearchRootState extends RootState {
    radioBrowser: RadioBrowserSearchState;
}
