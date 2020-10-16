import { TestBed } from '@angular/core/testing'
import { StreamMetadataFacadeService } from './stream-metadata-facade.service'
import { provideMockStore } from '@ngrx/store/testing'
import { initialRootState } from '../../models/initial-root-state'

describe('StreamMetadataFacadeService', () => {
    let service: StreamMetadataFacadeService

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [provideMockStore({ initialState: initialRootState })],
        })
        service = TestBed.inject(StreamMetadataFacadeService)
    })

    it('should be created', () => {
        expect(service).toBeTruthy()
    })
})
