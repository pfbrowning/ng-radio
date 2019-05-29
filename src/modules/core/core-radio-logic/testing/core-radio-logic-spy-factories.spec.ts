import { Subject, BehaviorSubject } from 'rxjs';
import { NowPlaying } from '@modules/core/core-radio-logic/core-radio-logic.module';

export class CoreRadioLogicSpyFactories {
  public static CreatePlayerServiceSpy(): any {
    const spy = jasmine.createSpyObj('playerService', ['playStation']);
    spy['nowPlaying$'] = new Subject<NowPlaying>();
    spy['paused$'] = new BehaviorSubject<boolean>(true);
    return spy;
  }

  public static CreateStationLookupServiceSpy(): any {
    const spy = jasmine.createSpyObj('stationLookupServiceSpy', [
      'searchStations',
      'getDeveloperSuggestions',
      'getTopClicked',
      'getTopVoted'
    ]);
    return spy;
  }
}
