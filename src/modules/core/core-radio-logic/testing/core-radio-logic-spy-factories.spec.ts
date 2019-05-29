import { Subject, BehaviorSubject } from 'rxjs';
import { NowPlaying } from '@modules/core/core-radio-logic/core-radio-logic.module';

export function createPlayerServiceSpy(): any {
  const spy = jasmine.createSpyObj('playerService', ['playStation']);
  spy['nowPlaying$'] = new Subject<NowPlaying>();
  spy['paused$'] = new BehaviorSubject<boolean>(true);
  return spy;
}

export function createStationLookupServiceSpy(): any {
  const spy = jasmine.createSpyObj('stationLookupServiceSpy', [
    'searchStations',
    'getDeveloperSuggestions',
    'getTopClicked',
    'getTopVoted'
  ]);
  return spy;
}