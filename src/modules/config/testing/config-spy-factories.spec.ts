import { Subject } from 'rxjs';

export class ConfigSpyFactories {
  public static CreateConfigServiceSpy(): any {
    const spy = jasmine.createSpyObj('configService', ['initialize']);
    spy['appConfig'] = {
      'metadataApiUrl': 'test.com',
      'radioBrowserApiUrl': 'test.com',
      'metadataRefreshInterval': 15000,
      'metadataFetchTimeout': 10
    };
    spy['loaded$'] = new Subject();
    spy['initialized'] = true;
    return spy;
  }
}
