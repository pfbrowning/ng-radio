import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';
import { RadioBrowserSearchEffects } from './effects';
import { provideMockStore } from '@ngrx/store/testing';
import { initialRootState } from '@core';
import { RouterTestingModule } from '@angular/router/testing';
import { CoreSpyFactories, ConfigStubService } from '@core/testing';
import { NotificationsService, RadioBrowserService, ConfigService } from '@core/services';

describe('RadioBrowserSearchEffects', () => {
  const actions$: Observable<any> = null;
  let effects: RadioBrowserSearchEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        RadioBrowserSearchEffects,
        provideMockActions(() => actions$),
        provideMockStore({ initialState: initialRootState }),
        {
          provide: RadioBrowserService,
          useValue: CoreSpyFactories.createRadioBrowserServiceSpy(),
        },
        { provide: ConfigService, useClass: ConfigStubService },
        {
          provide: NotificationsService,
          useValue: CoreSpyFactories.createNotificationsServiceSpy(),
        },
      ],
    });

    effects = TestBed.inject<RadioBrowserSearchEffects>(RadioBrowserSearchEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
