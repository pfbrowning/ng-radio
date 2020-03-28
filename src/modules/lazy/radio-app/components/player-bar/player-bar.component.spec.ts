import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
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
  PlayerService,
  CoreRadioLogicModule,
  NowPlaying,
  Station,
  StreamInfo,
  StreamInfoStatus,
  SleepTimerService
} from '@core-radio-logic';
import {
  createPlayerServiceSpy,
  createSleepTimerServiceSpy
} from '@core-radio-logic/testing';
import { NotificationService } from '@notifications';
import { KeepAwakeService } from '@keep-awake';
import { PlayerBarStationInfoComponent } from '../player-bar-station-info/player-bar-station-info.component';
import { ModalManagerModule } from '@browninglogic/ng-modal';
import { FormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SharedComponentsModule } from '@shared-components';
import { createKeepAwakeServiceSpy } from '@keep-awake/testing';
import { getElementBySelector, getElementTextBySelector } from '@test-helpers';
import { provideMockStore } from '@ngrx/store/testing';
import { initialRootState } from '@root-state';
import { createNotificationServiceSpy } from '@notifications/testing';

describe('PlayerBarComponent', () => {
  let component: PlayerBarComponent;
  let fixture: ComponentFixture<PlayerBarComponent>;
  let playerService: any;
  let sleepTimerService: any;
  let keepAwakeServiceSpy: any;

  beforeEach(async(() => {
    playerService = createPlayerServiceSpy();
    sleepTimerService = createSleepTimerServiceSpy();
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
        CoreRadioLogicModule,
        SharedComponentsModule
      ],
      providers: [
        { provide: PlayerService, useValue: playerService },
        { provide: NotificationService, useValue: createNotificationServiceSpy() },
        { provide: KeepAwakeService, useValue: keepAwakeServiceSpy },
        { provide: SleepTimerService, useValue: sleepTimerService },
        provideMockStore({ initialState: initialRootState })
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should bind updated nowPlaying info to the template and the station-info component', fakeAsync(() => {
    // Arrange: Define a few dummy NowPlaying entries
    const testEntries = [
      new NowPlaying(
        new Station(null, 'station title', 'http://url.com', 'station genre', 'http://icon.com/'),
        new StreamInfo('stream title', 'stream source', '128', 'station title from stream', 'stream description', 'stream genre'),
        StreamInfoStatus.Valid
      ),
      new NowPlaying(
        new Station(null, 'station title 2', 'http://url2.com', 'station genre 2', 'http://icon2.com/'),
        new StreamInfo('stream title 2', 'stream source 2', '256', 'station title from stream 2', 'stream description 2', 'stream genre 2'),
        StreamInfoStatus.Valid
      ),
      new NowPlaying(
        new Station(null, 'another station title', 'http://anotherurl.com', 'another station genre', 'http://anothericon.com/'),
        new StreamInfo('stream 3', 'another stream source', '64', 'station 3', 'another stream description', 'another stream genre'),
        StreamInfoStatus.Valid
      ),
      new NowPlaying(
        new Station(null, 'Radio Caprice: Speed Metal', 'http://radiocapricespeedmetal.com', 'Speed Metal', 'http://icon4.com/'),
        new StreamInfo('Radio Caprice Stream', 'source 4', '48', 'stream station title', 'awesome speed metal station', 'genre 4'),
        StreamInfoStatus.Valid
      )
    ];

    testEntries.forEach(nowPlaying => {
      // Act: Emit this iteration's NowPlaying entry and pause for the template bindings to catch up
      playerService.nowPlaying$.next(nowPlaying);
      tick(0);
      // Assert: Ensure that the NowPlaying data was bound to the template and stationInfo component
      expect(getElementBySelector<PlayerBarComponent>(fixture, '.station-icon-thumb').src).toBe(nowPlaying.station.iconUrl);
      expect(fixture.componentInstance.stationInfo.nowPlaying).toEqual(nowPlaying);
    });
  }));

  it('should update the template to reflect changes in minutes until sleep', () => {
    // Arrange: Emit an empty nowPlaying so that the player controls are rendered
    playerService.nowPlaying$.next(new NowPlaying(new Station(), new StreamInfo(null, null), StreamInfoStatus.Valid));

    for (let i = 300; i >= 0; i--) {
      // Act: Emit a new minutesUntilSleep value and detect changes
      sleepTimerService.minutesUntilSleep$.next(i);
      fixture.detectChanges();
      // Assert: Ensure that the new value was rendered properly in the template
      expect(getElementTextBySelector<PlayerBarComponent>(fixture, '.minutes-until-sleep')).toBe(i.toString());
    }

    /* Clear the sleep timer and ensure that 'minutes until sleep'
    no longer shows a number. */
    sleepTimerService.minutesUntilSleep$.next(null);
    fixture.detectChanges();
    expect(getElementTextBySelector<PlayerBarComponent>(fixture, '.minutes-until-sleep')).toBe('');
  });

  it('should update the template to reflect changes in the keepAwake state', () => {
    // Arrange
    // Emit an empty nowPlaying so that the player controls are rendered
    playerService.nowPlaying$.next(new NowPlaying(new Station(), new StreamInfo(null, null), StreamInfoStatus.Valid));
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

  it('should update the pause button on global play & pause', fakeAsync(() => {
    // Arrange
    // Emit an empty nowPlaying entry and detect changes to render the player controls
    playerService.nowPlaying$.next(new NowPlaying(new Station(), new StreamInfo(null, null), StreamInfoStatus.Valid));
    fixture.detectChanges();
    const getPlayPauseBtnText = () => getElementTextBySelector<PlayerBarComponent>(fixture, '.play-pause-button');
    // The 'Play' button should be drawn initially before we start to play something
    expect(getPlayPauseBtnText()).toBe('play_arrow');

    /* Act & Assert: Simulate a play & pause action and ensure that the correct button
    is rendered in the template accordingly. */
    playerService.paused$.next(false);
    tick();

    expect(getPlayPauseBtnText()).toBe('pause');

    playerService.paused$.next(true);
    tick();

    expect(getPlayPauseBtnText()).toBe('play_arrow');
  }));
});
