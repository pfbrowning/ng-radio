import { TestBed } from '@angular/core/testing';
import { CurrentTimeService } from '@core';
import { CoreSpyFactories } from '@core/testing';
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
    testScheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });

    currentTimeService = CoreSpyFactories.createCurrentTimeServiceSpy();
    proxyKeyService = CoreSpyFactories.createProxyKeyServiceSpy();
    playTimeIntervalService = new PlayTimeIntervalStubService();
  });

  it('should be created', () => {
    initializeService();
    expect(service).toBeTruthy();
  });

  describe('pingRadioProxyOnInterval$', () => {
    it('should do nothing if play stops after 24 minutes');

    it('should ping the radio proxy once if the audio plays for 49 minutes');

    it('should ping the radio proxy twice  if the audio plays for 74 minutes');

    it('should not perform duplicate HTTP requests if there are multiple subscribers');

    it('should include the duration of the ping in its emission');

    it('should hit the proxy key endpoint three times if  play lasts for 99 minutes');

    it('should continue gracefully if any of the proxy key calls fail');

    it('should gracefully handle a ping call which lasts for longer than the interval time');
  });
});
