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
import {
  CoreModule,
  Station,
  StreamInfo,
  StreamInfoStatus,
  KeepAwakeService
} from '@core';
import { createKeepAwakeServiceSpy } from '@core/testing';
import { NotificationService } from '@notifications';
import { PlayerBarStationInfoComponent } from '../player-bar-station-info/player-bar-station-info.component';
import { ModalManagerModule } from '@browninglogic/ng-modal';
import { FormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { getElementBySelector, getElementTextBySelector } from '@utilities/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { initialRootState, RootState } from '@root-state';
import { createNotificationServiceSpy } from '@notifications/testing';
import { SharedModule } from '@shared';
import { initialPlayerState, PlayerStatus } from '@root-state/player';
import theoretically from 'jasmine-theories';

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
        CoreModule,
        SharedModule
      ],
      providers: [
        { provide: NotificationService, useValue: createNotificationServiceSpy() },
        { provide: KeepAwakeService, useValue: keepAwakeServiceSpy },
        provideMockStore({ initialState: initialRootState })
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerBarComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update the template to reflect changes in minutes until sleep', () => {
    // Arrange
    let state: RootState = {
      ...initialRootState,
      player: {
        ...initialPlayerState,
        currentStation: new Station(),
        streamInfo: new StreamInfo(null, null),
        streamInfoStatus: StreamInfoStatus.Valid
      }
    };
    store.setState(state);

    for (let i = 300; i >= 0; i--) {
      // Act: Emit a new minutesUntilSleep value and detect changes
      state = {
        ...state,
        sleepTimer: {
          ...state.sleepTimer,
          minutesUntilSleep: i
        }
      };
      store.setState(state);
      fixture.detectChanges();
      // Assert: Ensure that the new value was rendered properly in the template
      expect(getElementTextBySelector<PlayerBarComponent>(fixture, '.minutes-until-sleep')).toBe(i.toString());
    }

    /* Clear the sleep timer and ensure that 'minutes until sleep'
    no longer shows a number. */
    state = {
      ...state,
      sleepTimer: {
        ...state.sleepTimer,
        minutesUntilSleep: null
      }
    };
    store.setState(state);
    fixture.detectChanges();
    expect(getElementTextBySelector<PlayerBarComponent>(fixture, '.minutes-until-sleep')).toBe('');
  });

  it('should update the template to reflect changes in the keepAwake state', () => {
    // Arrange
    const state: RootState = {
      ...initialRootState,
      player: {
        ...initialPlayerState,
        currentStation: new Station(),
        streamInfo: new StreamInfo(null, null),
        streamInfoStatus: StreamInfoStatus.Valid
      }
    };
    store.setState(state);
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
    let state: RootState = {
      ...initialRootState,
      player: {
        ...initialPlayerState,
        currentStation: new Station(),
        streamInfo: new StreamInfo(null, null),
        streamInfoStatus: StreamInfoStatus.Valid
      }
    };
    store.setState(state);

    fixture.detectChanges();
    const getPlayPauseBtnText = () => getElementTextBySelector<PlayerBarComponent>(fixture, '.play-pause-button');
    // The 'Play' button should be drawn initially before we start to play something
    expect(getPlayPauseBtnText()).toBe('play_arrow');

    /* Act & Assert: Simulate a play & pause action and ensure that the correct button
    is rendered in the template accordingly. */
    state = {
      ...state,
      player: {
        ...state.player,
        playerStatus: PlayerStatus.Playing
      }
    };
    store.setState(state);
    fixture.detectChanges();

    expect(getPlayPauseBtnText()).toBe('pause');

    state = {
      ...state,
      player: {
        ...state.player,
        playerStatus: PlayerStatus.Stopped
      }
    };
    store.setState(state);
    fixture.detectChanges();

    expect(getPlayPauseBtnText()).toBe('play_arrow');
  });
});
