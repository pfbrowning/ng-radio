import { TestBed } from '@angular/core/testing';
import { FavoriteStationsResolver } from './favorite-stations.resolver';

describe('FavoriteStationsResolver', () => {
  let resolver: FavoriteStationsResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(FavoriteStationsResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
