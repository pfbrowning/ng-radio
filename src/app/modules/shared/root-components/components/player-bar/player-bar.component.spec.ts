import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { PlayerBarComponent } from './player-bar.component';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { KeepAwakeService } from '@core';
import { PlayerBarStationInfoComponent } from '../player-bar-station-info/player-bar-station-info.component';
import { FormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { getElementBySelector, getElementTextBySelector } from '@utilities/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { initialRootState, RootState } from '@core';
import { SharedModule } from '@shared';
import { Station } from '@core/models/player';
import { CoreSpyFactories } from '@core/testing';
import { MatProgressButtonsModule } from 'mat-progress-buttons';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { StationIconStubDirective } from '@shared/testing';
import { BehaviorSubject, Observable, defer } from 'rxjs';
import { SleepTimerService } from '@core/services';
import { FavoriteStationsSelectors } from '@core/store/favorite-stations';


describe('PlayerBarComponent', () => {
  let component: PlayerBarComponent;
  let fixture: ComponentFixture<PlayerBarComponent>;
  let keepAwakeServiceSpy: any;
  let sleepTimerService: jasmine.SpyObj<SleepTimerService>;
  let store: MockStore<RootState>;
  let minutesUntilSleep$: Observable<number>;

  beforeEach(async(() => {
    keepAwakeServiceSpy = CoreSpyFactories.createKeepAwakeServiceSpy();
    sleepTimerService = CoreSpyFactories.createSleepTimerServiceSpy();
    sleepTimerService.minutesToSleep$ = defer(() => minutesUntilSleep$);

    TestBed.configureTestingModule({
      declarations: [
        PlayerBarComponent,
        PlayerBarStationInfoComponent,
        StationIconStubDirective
      ],
      imports: [
        RouterTestingModule,
        MatMenuModule,
        MatToolbarModule,
        MatButtonModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        MatTooltipModule,
        FormsModule,
        NoopAnimationsModule,
        SharedModule,
        MatProgressSpinnerModule,
        MatProgressButtonsModule.forRoot()
      ],
      providers: [
        provideMockStore({ initialState: initialRootState }),
        { provide: KeepAwakeService, useValue: keepAwakeServiceSpy },
        { provide: SleepTimerService, useValue: sleepTimerService },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerBarComponent);
    store = TestBed.inject(MockStore);
    store.overrideSelector(FavoriteStationsSelectors.selectCurrentStationOrMatchingFavorite, new Station());
    component = fixture.componentInstance;
  });

  afterEach(() => {
    store.resetSelectors();
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should update the template to reflect changes in minutes until sleep', () => {
    const minutesUntilSleep = new BehaviorSubject<number>(null);
    minutesUntilSleep$ = minutesUntilSleep.asObservable();
    for (let i = 300; i >= 0; i--) {
      // Act
      minutesUntilSleep.next(i);
      fixture.detectChanges();

      // Assert: Ensure that the new value was rendered properly in the template
      expect(getElementTextBySelector<PlayerBarComponent>(fixture, '.minutes-until-sleep')).toBe(i.toString());
    }

    /* Clear the sleep timer and ensure that 'minutes until sleep'
    no longer shows a number. */
    minutesUntilSleep.next(null);
    fixture.detectChanges();
    expect(getElementTextBySelector<PlayerBarComponent>(fixture, '.minutes-until-sleep')).toBe('');
  });

  it('should update the template to reflect changes in the keepAwake state', () => {
    // Arrange
    fixture.detectChanges();
    const keepAwakeElement = getElementBySelector<PlayerBarComponent>(fixture, '.keep-awake');
    // Set up a sequence of dummy boolean $enabled values to iterate through
    const testEntries = [ false, true, false, true, false ];

    testEntries.forEach(enabled => {
      // Act: Emit the test entry and detect changes to update the template
      keepAwakeServiceSpy.enabled$.next(enabled);
      fixture.detectChanges();
      // The keep awake element should have the off-white class if it's disabled and vice-versa
      expect(keepAwakeElement.classList.contains('off-white')).toBe(!enabled);
    });
  });
});
