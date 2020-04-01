import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';
import { RouterExtendedEffects } from './router-extended.effects';
import { LoadingIndicatorService } from '@browninglogic/ng-loading-indicator';
import { CreateLoadingIndicatorServiceSpy } from '@browninglogic/ng-loading-indicator/testing';

describe('RouterExtendedEffects', () => {
  const actions$: Observable<any> = null;
  let effects: RouterExtendedEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        RouterExtendedEffects,
        provideMockActions(() => actions$),
        { provide: LoadingIndicatorService, useValue: CreateLoadingIndicatorServiceSpy() }
      ]
    });

    effects = TestBed.inject<RouterExtendedEffects>(RouterExtendedEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
