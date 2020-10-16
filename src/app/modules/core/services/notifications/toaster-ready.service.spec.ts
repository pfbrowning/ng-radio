import { TestBed } from '@angular/core/testing';

import { ToasterReadyService } from './toaster-ready.service';

describe('ToasterReadyService', () => {
    let service: ToasterReadyService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ToasterReadyService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
