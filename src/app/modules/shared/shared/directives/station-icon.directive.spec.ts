import { StationIconDirective } from './station-icon.directive';
import { ConfigStubService } from '@core/testing';

describe('StationIconDirective', () => {
    it('should create an instance', () => {
        const configService = new ConfigStubService();
        const directive = new StationIconDirective(configService as any);
        expect(directive).toBeTruthy();
    });
});
