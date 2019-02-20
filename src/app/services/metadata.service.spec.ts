import { TestBed } from '@angular/core/testing';
import { MetadataService } from './metadata.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ConfigService } from './config.service';
import { SpyFactories } from '../testing/spy-factories.spec';

describe('MetadataService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      HttpClientTestingModule
    ],
    providers: [
      { provide: ConfigService, useValue: SpyFactories.CreateConfigServiceSpy() }
    ]
  }));

  it('should be created', () => {
    const service: MetadataService = TestBed.get(MetadataService);
    expect(service).toBeTruthy();
  });
});
