import { TestBed } from '@angular/core/testing';
import { PlayerFacadeService } from './player-facade.service';
import { provideMockStore } from '@ngrx/store/testing';
import { initialRootState } from '../../models/initial-root-state';

describe('PlayerFacadeService', () => {
  let service: PlayerFacadeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({ initialState: initialRootState })],
    });
    service = TestBed.inject(PlayerFacadeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
