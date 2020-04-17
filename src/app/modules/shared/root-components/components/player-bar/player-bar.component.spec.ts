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
import { createKeepAwakeServiceSpy } from '@core/testing';
import { PlayerBarStationInfoComponent } from '../player-bar-station-info/player-bar-station-info.component';
import { ModalManagerModule } from '@browninglogic/ng-modal';
import { FormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { getElementBySelector, getElementTextBySelector } from '@utilities/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { initialRootState, RootState } from '@core';
import { SharedModule } from '@shared';
import { initialPlayerState, PlayerStatus, Station, StreamInfoStatus } from '@core/models/player';
import { NowPlaying } from 'src/app/modules/core/models/player/now-playing';
import { selectMinutesUntilSleep, SleepTimerSelectors } from '@core/store/sleep-timer';
import { selectIsProcessingFavoritesForCurrentStation, FavoriteStationsSelectors } from '@core/store/favorite-stations';
import { PlayerSelectors } from '@core/store/player';
import { CurrentStationFavoritesProcessingState } from '@core/models/favorite-stations';


describe('PlayerBarComponent', () => {
  let component: PlayerBarComponent;
  let fixture: ComponentFixture<PlayerBarComponent>;
  let keepAwakeServiceSpy: any;
  let store: MockStore<RootState>;

  beforeEach(async(() => {
    keepAwakeServiceSpy = createKeepAwakeServiceSpy();

    TestBed.configureTestingModule({
      declarations: [
        PlayerBarComponent,
        PlayerBarStationInfoComponent
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
        ModalManagerModule,
        FormsModule,
        NoopAnimationsModule,
        SharedModule
      ],
      providers: [
        { provide: KeepAwakeService, useValue: keepAwakeServiceSpy },
        provideMockStore({ initialState: initialRootState })
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerBarComponent);
    store = TestBed.inject(MockStore);
    store.overrideSelector(PlayerSelectors.selectCurrentStation, new Station());
    component = fixture.componentInstance;
  });

  afterEach(() => {
    store.resetSelectors();
  })

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should update the template to reflect changes in minutes until sleep', () => {
    for (let i = 300; i >= 0; i--) {
      // Act
      store.overrideSelector(selectMinutesUntilSleep, i);
      store.refreshState();
      fixture.detectChanges();

      // Assert: Ensure that the new value was rendered properly in the template
      expect(getElementTextBySelector<PlayerBarComponent>(fixture, '.minutes-until-sleep')).toBe(i.toString());
    }

    /* Clear the sleep timer and ensure that 'minutes until sleep'
    no longer shows a number. */
    store.overrideSelector(selectMinutesUntilSleep, null);
    store.refreshState();
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

  it('should update the pause button on global play & pause', () => {
    // Arrange
    fixture.detectChanges();
    const getPlayPauseBtnText = () => getElementTextBySelector<PlayerBarComponent>(fixture, '.play-pause-button');
    // The 'Play' button should be drawn initially before we start to play something
    expect(getPlayPauseBtnText()).toBe('play_arrow');

    /* Act & Assert: Simulate a play & pause action and ensure that the correct button
    is rendered in the template accordingly. */
    store.overrideSelector(PlayerSelectors.selectPlayerStatus, PlayerStatus.Playing);
    store.refreshState();
    fixture.detectChanges();

    expect(getPlayPauseBtnText()).toBe('pause');

    store.overrideSelector(PlayerSelectors.selectPlayerStatus, PlayerStatus.Stopped);
    store.refreshState();
    fixture.detectChanges();

    expect(getPlayPauseBtnText()).toBe('play_arrow');
  });
});
