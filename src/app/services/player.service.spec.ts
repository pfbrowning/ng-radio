import { TestBed } from '@angular/core/testing';
import { PlayerService } from './player.service';
import { ConfigService } from './config.service';
import { SpyFactories } from '../testing/spy-factories.spec';
import { MetadataService } from './metadata.service';
import { NotificationService } from './notification.service';

describe('PlayerService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      { provide: ConfigService, useValue: SpyFactories.CreateConfigServiceSpy() },
      { provide: MetadataService, useValue: SpyFactories.CreateMetadataServiceSpy() },
      { provide: NotificationService, useValue: SpyFactories.CreateNotificationServiceSpy() }
    ]
  }));

  it('should be created', () => {
    const service: PlayerService = TestBed.get(PlayerService);
    expect(service).toBeTruthy();
  });
});
