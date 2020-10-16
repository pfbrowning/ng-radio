import { of } from 'rxjs'

export class RouterStateStubService {
    public navigationInProgress$ = of(false)
}
