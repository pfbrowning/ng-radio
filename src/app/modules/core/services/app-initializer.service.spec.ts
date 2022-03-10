import { RadioProxyPingerStubService } from '@core/testing';
import { AppInitializerService } from './app-initializer.service';
import { RadioProxyPingerService } from './radio-player/radio-proxy-pinger.service';

describe('AppInitializerService', () => {
  let service: AppInitializerService;
  let radioProxyPinger: RadioProxyPingerStubService;

  beforeEach(() => {
    radioProxyPinger = new RadioProxyPingerStubService();
    service = new AppInitializerService(radioProxyPinger as RadioProxyPingerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
