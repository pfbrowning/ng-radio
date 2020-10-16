import { TestBed } from '@angular/core/testing'

import { AudioElementService } from './audio-element.service'

describe('AudioElementService', () => {
    let service: AudioElementService

    beforeEach(() => {
        TestBed.configureTestingModule({})
        service = TestBed.inject(AudioElementService)
    })

    it('should be created', () => {
        expect(service).toBeTruthy()
    })
})
