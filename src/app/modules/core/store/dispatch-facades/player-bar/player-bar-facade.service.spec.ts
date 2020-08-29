import { TestBed } from '@angular/core/testing';
import { PlayerBarFacadeService } from './player-bar-facade.service';
import { initialRootState } from '../../../models/initial-root-state';
import { provideMockStore } from '@ngrx/store/testing';

describe('PlayerBarFacadeService', () => {
  let service: PlayerBarFacadeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideMockStore({initialState: initialRootState})
      ]
    });
    service = TestBed.inject(PlayerBarFacadeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
