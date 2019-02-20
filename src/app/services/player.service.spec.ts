import { TestBed } from '@angular/core/testing';
import { PlayerService } from './player.service';
import { ConfigService } from './config.service';
import { SpyFactories } from '../testing/spy-factories.spec';
import { MetadataService } from './metadata.service';
import { MessageService } from 'primeng/api';

describe('PlayerService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      { provide: ConfigService, useValue: SpyFactories.CreateConfigServiceSpy() },
      { provide: MetadataService, useValue: SpyFactories.CreateMetadataServiceSpy() },
      MessageService
    ]
  }));

  it('should be created', () => {
    const service: PlayerService = TestBed.get(PlayerService);
    expect(service).toBeTruthy();
  });
});
