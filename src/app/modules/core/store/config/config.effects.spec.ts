import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';
import { ConfigEffects } from './config.effects';
import { ConfigService } from '../../services/config.service';
import { NotificationService } from '@core';
import { CoreSpyFactories } from '@core/testing';

describe('ConfigEffects', () => {
  const actions$: Observable<any> = null;
  let effects: ConfigEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ConfigEffects,
        provideMockActions(() => actions$),
        { provide: ConfigService, useValue: CoreSpyFactories.createConfigServiceSpy() },
        { provide: NotificationService, useValue: CoreSpyFactories.createNotificationServiceSpy() }
      ]
    });

    effects = TestBed.inject<ConfigEffects>(ConfigEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
