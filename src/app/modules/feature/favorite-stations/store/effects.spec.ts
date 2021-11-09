import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';
import { provideMockStore } from '@ngrx/store/testing';
import { initialRootState } from '@core';
import { RouterTestingModule } from '@angular/router/testing';
import { CoreSpyFactories, ConfigStubService } from '@core/testing';
import { NotificationsService, RadioBrowserService, ConfigService } from '@core/services';
import { FavoriteStationsFeatureEffects } from './effects';

describe('FavoriteStationsFeatureEffects', () => {
  const actions$: Observable<any> = null;
  let effects: FavoriteStationsFeatureEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        FavoriteStationsFeatureEffects,
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

    effects = TestBed.inject<FavoriteStationsFeatureEffects>(FavoriteStationsFeatureEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
