import { TestBed } from '@angular/core/testing';
import { ApplicationEffects } from './application.effects';

describe('ApplicationEffects', () => {
  let effects: ApplicationEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ApplicationEffects
      ]
    });

    effects = TestBed.inject<ApplicationEffects>(ApplicationEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
