import { Injectable } from '@angular/core'
import { BehaviorSubject } from 'rxjs'
import { WindowService } from './window.service'

@Injectable({ providedIn: 'root' })
export class WindowFocusService {
    private focusedSource = new BehaviorSubject<boolean>(true)
    public focused$ = this.focusedSource.asObservable()

    constructor(windowService: WindowService) {
        windowService.focus.subscribe(() => this.focusedSource.next(true))
        windowService.blur.subscribe(() => this.focusedSource.next(false))
    }
}
