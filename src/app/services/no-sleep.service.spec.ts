import { TestBed } from '@angular/core/testing';

import { NoSleepService } from './no-sleep.service';
import { PlayerService } from './player.service';
import { SpyFactories } from '../testing/spy-factories.spec';

describe('NoSleepService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      { provide: PlayerService, useValue: SpyFactories.CreatePlayerServiceSpy() }
    ]
  }));

  it('should be created', () => {
    const service: NoSleepService = TestBed.get(NoSleepService);
    expect(service).toBeTruthy();
  });
});
