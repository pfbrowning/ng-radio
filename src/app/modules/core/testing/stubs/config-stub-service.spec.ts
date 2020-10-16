import { of } from 'rxjs';

export class ConfigStubService {
    public appConfig = {
        radioBrowserApiUrl: 'test.com',
    };
    public appConfig$ = of(this.appConfig);
}
