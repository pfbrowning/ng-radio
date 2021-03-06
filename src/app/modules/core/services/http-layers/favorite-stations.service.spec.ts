import { TestBed } from '@angular/core/testing';
import { FavoriteStationsService } from './favorite-stations.service';
import { ConfigService } from '@core/services';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ConfigStubService } from '@core/testing';

describe('FavoriteStationsService', () => {
    let service: FavoriteStationsService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                { provide: ConfigService, useClass: ConfigStubService },
            ],
        });
        service = TestBed.inject(FavoriteStationsService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
