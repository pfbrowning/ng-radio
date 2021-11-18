import { TestBed } from '@angular/core/testing';
import { IntervalPingerService } from './interval-pinger.service';
import { TestScheduler } from 'rxjs/testing';
import { CoreSpyFactories, PlayerFacadeStub } from '@core/testing';
import { ProxyKeyService } from './radio-player/proxy-key.service';
import { PlayerFacadeService } from '@core/store';
import { of } from 'rxjs';
import { PlayerStatus } from '@core/models/player';
import { PingResult } from '../models/interval-pinger/ping-result';
import { PingResultStatus } from '../models/interval-pinger/ping-result-status';

describe('IntervalPingerService', () => {
  let service: IntervalPingerService;
  let playerFacade: PlayerFacadeStub;
  let proxyKeyService: jasmine.SpyObj<ProxyKeyService>;
  let testScheduler: TestScheduler;

  const initializeService = () =>
    (service = new IntervalPingerService(playerFacade as PlayerFacadeService, proxyKeyService));

  beforeEach(() => {
    testScheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });

    playerFacade = new PlayerFacadeStub();
    playerFacade.playerStatus$ = of(PlayerStatus.Playing);

    proxyKeyService = CoreSpyFactories.createProxyKeyServiceSpy();
  });

  it('should be created', () => {
    initializeService();
    expect(service).toBeTruthy();
  });

  it('should do nothing if play stops immediately before 24 minutes after it started', () => {
    testScheduler.run(helpers => {
      // Arrange
      playerFacade.playerStatus$ = helpers.hot('a 24m 59s 999ms b', {
        a: PlayerStatus.Playing,
        b: PlayerStatus.Stopped,
      });
      const expectedDiagram = '-';
      const expectedValues = {};

      initializeService();

      // Act & Assert
      helpers
        .expectObservable(service.pingRadioProxyOnIntervalWhilePlaying$)
        .toBe(expectedDiagram, expectedValues);
    });
    expect(proxyKeyService.fetchNew).not.toHaveBeenCalled();
  });

  it('should hit the proxy key endpoint once if play lasts until immediately before 50 minutes after starting', () => {
    testScheduler.run(helpers => {
      // Arrange
      playerFacade.playerStatus$ = helpers.hot('a 49m 59s 999ms b', {
        a: PlayerStatus.Playing,
        b: PlayerStatus.Stopped,
      });
      const expectedDiagram = '25m 1s a -';
      const mockSuccessfulPingResult: PingResult = { status: PingResultStatus.Success };
      const expectedValues = { a: mockSuccessfulPingResult };

      const fetch$ = helpers.cold('1s (a|)', { a: 'derp' });
      proxyKeyService.fetchNew.and.returnValue(fetch$);

      initializeService();

      // Act & Assert
      helpers
        .expectObservable(service.pingRadioProxyOnIntervalWhilePlaying$)
        .toBe(expectedDiagram, expectedValues);
    });
    expect(proxyKeyService.fetchNew).toHaveBeenCalledTimes(1);
  });

  it('should log a successful ping');

  it('should emit and log a notification upon the start of a ping request');

  it(
    'should hit the proxy key endpoint twice if play lasts until immediately before 75 minutes after starting'
  );

  it(
    'should hit the proxy key endpoint three times if play lasts until immediately before 100 minutes after starting'
  );

  it('should never do anything if we never actually play anything');

  it(
    'should hit the proxy key endpoint after playing for 25 minutes when there was a delay before starting the audio'
  );

  it(
    'should continue to start and stop the interval as play continues to start and stop over time'
  );

  it('should continue gracefully if any of the proxy key calls fail');

  it('should log a failed ping');

  it('should gracefully handle a ping call which lasts for longer than the interval time');

  it('should cancel a ping if the audio stops while the ping is in progress');
});
