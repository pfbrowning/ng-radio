import { TestBed } from '@angular/core/testing';

import { PlayerFacadeService } from './player-facade.service';

describe('PlayerFacadeService', () => {
  let service: PlayerFacadeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlayerFacadeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
