import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';
import { PlayerEffects } from './player.effects';

describe('PlayerEffects', () => {
  let actions$: Observable<any>;
  let effects: PlayerEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PlayerEffects,
        provideMockActions(() => actions$)
      ]
    });

    effects = TestBed.get<PlayerEffects>(PlayerEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
