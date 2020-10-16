import { TestBed } from '@angular/core/testing'
import { SuggestedStationsService } from './suggested-stations.service'
import { HttpClientTestingModule } from '@angular/common/http/testing'

describe('SuggestedStationsService', () => {
    let service: SuggestedStationsService

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
        })
        service = TestBed.inject(SuggestedStationsService)
    })

    it('should be created', () => {
        expect(service).toBeTruthy()
    })
})
