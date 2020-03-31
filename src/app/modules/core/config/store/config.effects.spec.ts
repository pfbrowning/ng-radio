import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';
import { ConfigEffects } from './config.effects';
import { ConfigService } from '../services/config.service';
import { createConfigServiceSpy } from '../testing/config-spy-factories.spec';
import { NotificationService } from '@notifications';
import { createNotificationServiceSpy } from '@notifications/testing';

describe('ConfigEffects', () => {
  const actions$: Observable<any> = null;
  let effects: ConfigEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ConfigEffects,
        provideMockActions(() => actions$),
        { provide: ConfigService, useValue: createConfigServiceSpy() },
        { provide: NotificationService, useValue: createNotificationServiceSpy() }
      ]
    });

    effects = TestBed.inject<ConfigEffects>(ConfigEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});