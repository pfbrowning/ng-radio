import { Observable } from 'rxjs'
import { PlayerStatus } from '../../models/player/player-status'
import { Station } from '../../models/player/station'

export class PlayerFacadeStub {
    public playerStatus$: Observable<PlayerStatus>
    public currentStation$: Observable<Station>
}
