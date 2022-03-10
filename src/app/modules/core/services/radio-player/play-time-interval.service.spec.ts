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
          'a 59s 999ms b 59s 999ms c 59s 999ms d 59s 999ms e 59s 999ms f 59s 999ms g 59s 999ms h 59s 999ms i 59s 999ms j 59s 999ms k';
        const expectedValues = {
          a: 0,
          b: 1,
          c: 2,
          d: 3,
          e: 4,
          f: 5,
          g: 6,
          h: 7,
          i: 8,
          j: 9,
          k: 10,
        };

        initializeService();

        // Act & Assert
        helpers.expectObservable(service.playTimeInMinutes$).toBe(expectedDiagram, expectedValues);
      });
    });

    it('should wait until play starts before starting to emit minute values', () => {
      testScheduler.run(helpers => {
        // Arrange
        const isAudioPlayingDiagram = ' a   10m b 2m                    c';
        const isAudioPlayingValues = { a: false, b: true, c: false };
        const expectedDiagram = '       1ms 10m a 59s 999ms b 59s 999ms c';
        const expectedValues = { a: 0, b: 1, c: 2 };
        playerFacade.isAudioPlaying$ = helpers.hot(isAudioPlayingDiagram, isAudioPlayingValues);

        initializeService();

        // Act & Assert
        helpers.expectObservable(service.playTimeInMinutes$).toBe(expectedDiagram, expectedValues);
      });
    });

    it('should continue to start and stop the interval as play starts and stops over time', () => {
      testScheduler.run(helpers => {
        // Arrange
        const isAudioPlayingDiagram = ' a   10m b 1m          c 1m    d 1m         e';
        const isAudioPlayingValues = { a: false, b: true, c: false, d: true, e: false };
        const expectedDiagram = '       1ms 10m a 59s 999ms b 1ms 1m  c 59s 999ms d';
        const expectedValues = { a: 0, b: 1, c: 0, d: 1 };
        playerFacade.isAudioPlaying$ = helpers.hot(isAudioPlayingDiagram, isAudioPlayingValues);

        initializeService();

        // Act & Assert
        helpers.expectObservable(service.playTimeInMinutes$).toBe(expectedDiagram, expectedValues);
      });
    });
  });
});
