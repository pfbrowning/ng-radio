import { Injectable } from '@angular/core'
import { ReplaySubject } from 'rxjs'
import { take } from 'rxjs/operators'

@Injectable({ providedIn: 'root' })
export class ToasterReadyService {
    private toasterReadySource = new ReplaySubject<void>(1)
    public toasterReady$ = this.toasterReadySource.pipe(take(1))

    public toasterInitialized() {
        this.toasterReadySource.next()
    }
}
