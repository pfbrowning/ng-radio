import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';

import { SuggestedStationsEffects } from './suggested-stations.effects';

describe('SuggestedStationsEffects', () => {
  let actions$: Observable<any>;
  let effects: SuggestedStationsEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SuggestedStationsEffects,
        provideMockActions(() => actions$)
      ]
    });

    effects = TestBed.get<SuggestedStationsEffects>(SuggestedStationsEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
