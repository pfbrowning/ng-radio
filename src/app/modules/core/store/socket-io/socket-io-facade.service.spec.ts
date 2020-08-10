import { TestBed } from '@angular/core/testing';

import { SocketIoFacadeService } from './socket-io-facade.service';

describe('SocketIoFacadeService', () => {
  let service: SocketIoFacadeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SocketIoFacadeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
