import { TestBed } from '@angular/core/testing';
import { FavoriteStationsFacadeService } from './favorite-stations-facade.service';
import { provideMockStore } from '@ngrx/store/testing';
import { initialRootState } from '../../models/initial-root-state';

describe('FavoriteStationsFacadeService', () => {
  let service: FavoriteStationsFacadeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({ initialState: initialRootState })],
    });
    service = TestBed.inject(FavoriteStationsFacadeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
