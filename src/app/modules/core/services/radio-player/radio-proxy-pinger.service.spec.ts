import { TestBed } from '@angular/core/testing';
import { CurrentTimeService } from '@core';
import { CoreSpyFactories } from '@core/testing';
import { hot } from 'jasmine-marbles';
import { TestScheduler } from 'rxjs/testing';
import { PlayTimeIntervalStubService } from '../../testing/stubs/play-time-interval-stub.service.spec';
import { PlayTimeIntervalService } from './play-time-interval.service';
import { ProxyKeyService } from './proxy-key.service';
import { RadioProxyPingerService } from './radio-proxy-pinger.service';

describe('RadioProxyPingerService', () => {
  let service: RadioProxyPingerService;
  let playTimeIntervalService: PlayTimeIntervalStubService;
  let proxyKeyService: jasmine.SpyObj<ProxyKeyService>;
  let currentTimeService: jasmine.SpyObj<CurrentTimeService>;
  let testScheduler: TestScheduler;

  const initializeService = () =>
    (service = new RadioProxyPingerService(
      playTimeIntervalService as PlayTimeIntervalService,
      proxyKeyService,
      currentTimeService
    ));

  beforeEach(() => {
    currentTimeService = CoreSpyFactories.createCurrentTimeServiceSpy();
    proxyKeyService = CoreSpyFactories.createProxyKeyServiceSpy();
    playTimeIntervalService = new PlayTimeIntervalStubService();
  });

  it('should be created', () => {
    initializeService();
    expect(service).toBeTruthy();
  });

  it('should do nothing if play stops after 24 minutes', () => {
    // Arrange
    playTimeIntervalService.playTimeInMinutes$ = hot('a-b-c', { a: 0, b: 1, c: 24 });
    const expected$ = hot('-');
    initializeService();

    // Act & Assert
    expect(service.startPing$).toBeObservable(expected$);
  });

  it('should ping the radio proxy once if the audio plays for 49 minutes', () => {
    // Arrange
    const playTimeDiagram = 'a-b-c-d-e';
    const playTimeValues = { a: 0, b: 24, c: 25, d: 26, e: 49 };
    const expectedDiagram = '----a';
    const expectedValues = { a: { pingStartTime: undefined } };

    playTimeIntervalService.playTimeInMinutes$ = hot(playTimeDiagram, playTimeValues);
    const expected$ = hot(expectedDiagram, expectedValues);

    initializeService();

    // Act & Assert
    expect(service.startPing$).toBeObservable(expected$);
  });

  it('should ping the radio proxy twice if the audio plays for 74 minutes', () => {
    // Arrange
    const mockStartPingEmission = { pingStartTime: undefined };
    const playTimeDiagram = 'a-b-c-d-e-f-g-h';
    const playTimeValues = { a: 0, b: 24, c: 25, d: 26, e: 49, f: 50, g: 51, h: 74 };
    const expectedDiagram = '----a-----b';
    const expectedValues = { a: mockStartPingEmission, b: mockStartPingEmission };

    playTimeIntervalService.playTimeInMinutes$ = hot(playTimeDiagram, playTimeValues);
    const expected$ = hot(expectedDiagram, expectedValues);

    initializeService();

    // Act & Assert
    expect(service.startPing$).toBeObservable(expected$);
  });

  it('should call the radio proxy upon startPing$');

  it('should emit pingSucceeded$ upon ping success');

  it('should emit pingFailed$ upon ping failure');

  it('should not perform duplicate HTTP requests if there are multiple subscribers');

  it('should include the duration of the ping in its emission');

  it('should continue gracefully if any of the proxy key calls fail');

  it('should gracefully handle a ping call which lasts for longer than the interval time');
});
