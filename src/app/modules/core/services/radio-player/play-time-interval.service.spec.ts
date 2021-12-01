import { TestBed } from '@angular/core/testing';
import { TestScheduler } from 'rxjs/testing';
import { PlayerFacadeService } from '../../store/player/player-facade.service';
import { PlayerFacadeStub } from '../../testing/stubs/player-facade-stub.service.spec';
import { PlayTimeIntervalService } from './play-time-interval.service';

describe('PlayTimeIntervalService', () => {
  let service: PlayTimeIntervalService;
  let playerFacade: PlayerFacadeStub;
  let testScheduler: TestScheduler;

  const initializeService = () =>
    (service = new PlayTimeIntervalService(playerFacade as PlayerFacadeService));

  beforeEach(() => {
    testScheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });

    playerFacade = new PlayerFacadeStub();
  });

  it('should be created', () => {
    initializeService();
    expect(service).toBeTruthy();
  });

  describe('playTimeInMinutes$', () => {
    it('should emit the number of minutes at each minute mark for the duration of play', () => {
      testScheduler.run(helpers => {
        // Arrange
        playerFacade.isAudioPlaying$ = helpers.hot('a 10m b', {
          a: true,
          b: false,
        });
        const expectedDiagram =
          '1m a 59s 999ms b 59s 999ms c 59s 999ms d 59s 999ms e 59s 999ms f 59s 999ms g 59s 999ms h 59s 999ms i 59s 999ms j';
        const expectedValues = {
          a: 1,
          b: 2,
          c: 3,
          d: 4,
          e: 5,
          f: 6,
          g: 7,
          h: 8,
          i: 9,
          j: 10,
        };

        initializeService();

        // Act & Assert
        helpers.expectObservable(service.playTimeInMinutes$).toBe(expectedDiagram, expectedValues);
      });
    });

    it('should wait until play starts before starting to emit minute values');

    it('should continue to start and stop the interval as play starts and stops over time');
  });
});
