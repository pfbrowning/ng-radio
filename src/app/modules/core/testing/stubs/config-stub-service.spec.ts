import { of } from 'rxjs';

export class ConfigStubService {
    public appConfig = {
        'metadataApiUrl': 'test.com',
        'radioBrowserApiUrl': 'test.com',
        'metadataRefreshInterval': 15000,
        'metadataFetchTimeout': 10
    };
    public appConfig$ = of(this.appConfig);
}
