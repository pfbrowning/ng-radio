import { BehaviorSubject } from 'rxjs';
import { NowPlaying } from '@modules/core/core-radio-logic/core-radio-logic.module';
import { StreamInfoStatus } from '../models/stream-info-status';

export function createPlayerServiceSpy(): any {
  const spy = jasmine.createSpyObj('playerService', ['playStation']);
  spy['nowPlaying$'] = new BehaviorSubject<NowPlaying>(new NowPlaying(null, null, StreamInfoStatus.NotInitialized));
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

export function createSleepTimerServiceSpy(): any {
  const spy = jasmine.createSpyObj('sleepTimerServiceSpy', [
    'setTimer',
    'cancelTimer'
  ]);
  spy['minutesUntilSleep$'] = new BehaviorSubject<number>(null);
  return spy;
}
