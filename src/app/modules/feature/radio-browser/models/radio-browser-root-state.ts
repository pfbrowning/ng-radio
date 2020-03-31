import { RootState } from '@core';
import { RadioBrowserState } from './radio-browser-state';

export interface RadioBrowserRootState extends RootState {
    radioBrowser: RadioBrowserState;
}
