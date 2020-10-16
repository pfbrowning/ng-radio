import { RootState } from '@core'
import { RadioBrowserSearchState } from './radio-browser-search-state'

export interface RadioBrowserSearchRootState extends RootState {
    radioBrowserSearch: RadioBrowserSearchState
}
