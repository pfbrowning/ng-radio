import { TestBed } from '@angular/core/testing';
import { PlayerService } from './player.service';
import { ConfigService } from './config.service';
import { SpyFactories } from '../testing/spy-factories.spec';
import { MetadataService } from './metadata.service';
import { NotificationService } from './notification.service';
import { AudioElementToken } from '../injection-tokens/audio-element-token';
import { AudioElementStub } from '../testing/stubs/AudioElementStub';

describe('PlayerService', () => {
  let playerService: PlayerService;
  let audioPausedSpy: jasmine.Spy;
  let audioElement: AudioElementStub;

  beforeEach(() => {
    audioElement = new AudioElementStub();

    TestBed.configureTestingModule({
      providers: [
        { provide: ConfigService, useValue: SpyFactories.CreateConfigServiceSpy() },
        { provide: MetadataService, useValue: SpyFactories.CreateMetadataServiceSpy() },
        { provide: NotificationService, useValue: SpyFactories.CreateNotificationServiceSpy() },
        { provide: AudioElementToken, useValue: audioElement }
      ]
    });
    playerService = TestBed.get(PlayerService);
    audioPausedSpy = jasmine.createSpy('audioPaused');
    playerService.audioPaused.subscribe(() => audioPausedSpy());
  });

  it('should be created', () => {
    expect(playerService).toBeTruthy();
  });

  it('should properly handle audio pause event', () => {
    expect(audioPausedSpy).not.toHaveBeenCalled();
    audioElement.pause();
    expect(audioPausedSpy).toHaveBeenCalledTimes(1);
  });
});
