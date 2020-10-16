import { TestBed } from '@angular/core/testing'
import { ProxyKeyService } from './proxy-key.service'
import { ConfigService } from '../config/config.service'
import { ConfigStubService } from '../../testing/stubs/config-stub-service.spec'
import { HttpClientTestingModule } from '@angular/common/http/testing'

describe('ProxyKeyService', () => {
    let service: ProxyKeyService

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                { provide: ConfigService, useClass: ConfigStubService },
            ],
        })
        service = TestBed.inject(ProxyKeyService)
    })

    it('should be created', () => {
        expect(service).toBeTruthy()
    })
})
