import { TestBed } from '@angular/core/testing';
import { CurrentTimeService } from '@core';
import { CoreSpyFactories } from '@core/testing';
import { cold, hot } from 'jasmine-marbles';
import { of, Subject } from 'rxjs';
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

  const constructService = () =>
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
    constructService();
    expect(service).toBeTruthy();
  });

  it('should do nothing if play stops after 24 minutes', () => {
    // Arrange
    playTimeIntervalService.playTimeInMinutes$ = hot('a-b-c', { a: 0, b: 1, c: 24 });
    const expected$ = hot('-');
    constructService();

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

    constructService();

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

    constructService();

    // Act & Assert
    expect(service.startPing$).toBeObservable(expected$);
  });

  it('should call the radio proxy upon startPing$', () => {
    // Arrange
    const mockStartPingEmission = { pingStartTime: undefined };
    const playTimeDiagram = 'a-b-c';
    const playTimeValues = { a: 25, b: 50, c: 75 };
    const expectedDiagram = 'a-a-a';
    const expectedValues = { a: mockStartPingEmission };

    playTimeIntervalService.playTimeInMinutes$ = hot(playTimeDiagram, playTimeValues);
    const expected$ = hot(expectedDiagram, expectedValues);

    proxyKeyService.fetchNew.and.returnValue(cold('(a|)', { a: 'value' }));

    constructService();
    service.initialize();

    // Act
    const result$ = service.startPing$;

    // Assert
    expect(result$).toBeObservable(expected$);
    expect(proxyKeyService.fetchNew).toHaveBeenCalledTimes(3);
  });

  it('should emit pingSucceeded$ upon ping success', () => {
    // Arrange
    const playTimeDiagram = 'a';
    const playTimeValues = { a: 25 };
    const expectedDiagram = '-a';
    const expectedValues = { a: { pingDuration: 0 } };

    playTimeIntervalService.playTimeInMinutes$ = hot(playTimeDiagram, playTimeValues);
    const expected$ = hot(expectedDiagram, expectedValues);

    proxyKeyService.fetchNew.and.returnValue(cold('-(a|)', { a: 'value' }));
    currentTimeService.unixMs.and.returnValue(0);

    constructService();

    // Act
    const result$ = service.pingSucceeded$;

    // Assert
    expect(result$).toBeObservable(expected$);
    expect(proxyKeyService.fetchNew).toHaveBeenCalledTimes(1);
  });

  it('should emit pingFailed$ upon ping failure', () => {
    // Arrange
    const playTimeDiagram = 'a';
    const playTimeValues = { a: 25 };
    const expectedDiagram = '-a';
    const expectedValues = { a: { pingDuration: 0, error: 'Mock Error' } };

    playTimeIntervalService.playTimeInMinutes$ = hot(playTimeDiagram, playTimeValues);
    const expected$ = hot(expectedDiagram, expectedValues);

    proxyKeyService.fetchNew.and.returnValue(cold('-#', {}, 'Mock Error'));
    currentTimeService.unixMs.and.returnValue(0);

    constructService();

    // Act
    const result$ = service.pingFailed$;

    // Assert
    expect(result$).toBeObservable(expected$);
    expect(proxyKeyService.fetchNew).toHaveBeenCalledTimes(1);
  });

  it('should include the duration of the ping in its emission', () => {
    // Arrange
    const playTimeDiagram = 'a';
    const playTimeValues = { a: 25 };
    const expectedDiagram = '-a';
    const expectedValues = { a: { pingDuration: 1 } };

    playTimeIntervalService.playTimeInMinutes$ = hot(playTimeDiagram, playTimeValues);
    const expected$ = hot(expectedDiagram, expectedValues);

    const createIncrementClosure = () => {
      let count = 0;
      return () => count++;
    };
    currentTimeService.unixMs.and.callFake(createIncrementClosure());
    proxyKeyService.fetchNew.and.returnValue(cold('-(a|)', { a: 'value' }));

    constructService();

    // Act
    const result$ = service.pingSucceeded$;

    // Assert
    expect(result$).toBeObservable(expected$);
    expect(proxyKeyService.fetchNew).toHaveBeenCalledTimes(1);
    expect(currentTimeService.unixMs).toHaveBeenCalledTimes(2);
  });

  it('should not perform duplicate HTTP requests if there are multiple subscribers', () => {
    // Arrange
    const playTimeSubject = new Subject<number>();
    playTimeIntervalService.playTimeInMinutes$ = playTimeSubject.asObservable();

    proxyKeyService.fetchNew.and.returnValue(cold('(a|)', { a: 'value' }));

    constructService();

    service.startPing$.subscribe();
    service.startPing$.subscribe();
    service.pingSucceeded$.subscribe();
    service.pingSucceeded$.subscribe();
    service.pingFailed$.subscribe();
    service.pingFailed$.subscribe();

    // Act
    playTimeSubject.next(25);

    // Assert
    expect(proxyKeyService.fetchNew).toHaveBeenCalledTimes(1);
  });

  it('should continue gracefully if any of the proxy key calls fail', () => {
    // Arrange
    const playTimeDiagram = '         a--b--c';
    const playTimeValues = { a: 25, b: 50, c: 75 };
    const expectedSucceededDiagram = '-a-----a';
    const expectedSucceededValues = { a: { pingDuration: 0 } };
    const expectedFailedDiagram = '   ----a';
    const expectedFailedValues = { a: null };

    playTimeIntervalService.playTimeInMinutes$ = hot(playTimeDiagram, playTimeValues);
    const expectedSuccessStream$ = hot(expectedSucceededDiagram, expectedSucceededValues);
    const expectedFailureStream$ = hot(expectedFailedDiagram, expectedFailedValues);

    // Fail on the second call
    const createProxyKeyFetchClosure = () => {
      let count = 0;
      return () => {
        count++;
        console.log('count', count);
        if (count === 2) {
          console.log('failing');
          return cold('-#', {}, 'Mock Error');
        } else {
          return cold('-(a|)', { a: 'value' });
        }
      };
    };
    proxyKeyService.fetchNew.and.callFake(createProxyKeyFetchClosure());
    currentTimeService.unixMs.and.returnValue(0);

    constructService();

    // Act
    const successStreamResult$ = service.pingSucceeded$;
    const failureStreamResult$ = service.pingFailed$;

    // Assert
    expect(successStreamResult$).toBeObservable(expectedSuccessStream$);
    expect(failureStreamResult$).toBeObservable(expectedFailureStream$);
    expect(proxyKeyService.fetchNew).toHaveBeenCalledTimes(3);
  });

  it('should gracefully handle a ping call which lasts for longer than the interval time');
});
