import { ComponentFixture, TestBed, async, fakeAsync, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { NowPlayingComponent } from './now-playing.component';
import { RouterTestingModule } from '@angular/router/testing';
import {
  CoreModule,
  KeepAwakeService
} from '@core';
import { createKeepAwakeServiceSpy } from '@core/testing';
import { MatMenuModule } from '@angular/material/menu';
import { NotificationService } from '@notifications';
import { ModalManagerModule } from '@browninglogic/ng-modal';
import { MatInputModule } from '@angular/material/input';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { getElementBySelector, getElementTextBySelector } from '@utilities/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { initialRootState, RootState } from '@root-state';
import { createNotificationServiceSpy } from '@notifications/testing';
import { SharedModule } from '@shared';
import { PlayerStatus, initialPlayerState, Station, StreamInfo, StreamInfoStatus } from '@root-state/player';
import isBlank from 'is-blank';
import theoretically from 'jasmine-theories';


describe('NowPlayingComponent', () => {
  let component: NowPlayingComponent;
  let fixture: ComponentFixture<NowPlayingComponent>;
  let keepAwakeServiceSpy: any;
  let store: MockStore<RootState>;

  beforeEach(async(() => {
    keepAwakeServiceSpy = createKeepAwakeServiceSpy();

    TestBed.configureTestingModule({
      declarations: [
        NowPlayingComponent
      ],
      imports: [
        RouterTestingModule,
        MatMenuModule,
        ModalManagerModule,
        MatFormFieldModule,
        MatInputModule,
        NoopAnimationsModule,
        FormsModule,
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
    fixture = TestBed.createComponent(NowPlayingComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  const nowPlayingTemplateInput = [
    {
      station: new Station(null, 'station title', 'http://url.com', 'station genre', 'http://icon.com/'),
      streamInfo: new StreamInfo('stream title', 'stream source', '128', 'station title from stream', 'stream description', 'stream genre'),
      streamInfoStatus: StreamInfoStatus.Valid
    },
    {
      station: new Station(null, 'station title 2', 'http://url2.com', 'station genre 2', 'http://icon2.com/'),
      streamInfo: new StreamInfo('stream title 2', 'stream source 2', '256', 'station title from stream 2', 'stream description 2', 'stream genre 2'),
      streamInfoStatus: StreamInfoStatus.Valid
    },
    {
      station: new Station(null, 'another station title', 'http://anotherurl.com', 'another station genre', 'http://anothericon.com/'),
      streamInfo: new StreamInfo('stream 3', 'another stream source', '64', 'station 3', 'another stream description', 'another stream genre'),
      streamInfoStatus: StreamInfoStatus.Valid
    },
    {
      station: new Station(null, 'Radio Caprice: Speed Metal', 'http://radiocapricespeedmetal.com', 'Speed Metal', 'http://icon4.com/'),
      streamInfo: new StreamInfo(
        'Radio Caprice Stream', 'source 4', '48', 'stream station title', 'awesome speed metal station', 'genre 4'
      ),
      streamInfoStatus: StreamInfoStatus.Valid
    }
  ];
  theoretically.it('should update the template to reflect changes in nowPlaying metadata', nowPlayingTemplateInput, (input) => {
    // Act
    store.setState({
      ...initialRootState,
      player: {
        ...initialPlayerState,
        currentStation: input.station,
        streamInfo: input.streamInfo,
        streamInfoStatus: input.streamInfoStatus,
        playerStatus: PlayerStatus.Playing
      }
    });
    fixture.detectChanges();

    // Assert: Ensure that the important NowPlaying properties were properly bound to the template
    expect(getElementBySelector<NowPlayingComponent>(fixture, '.station-icon').src).toBe(input.station.iconUrl);
    expect(getElementTextBySelector<NowPlayingComponent>(fixture, '.station-title')).toBe(input.station.title);
    expect(getElementTextBySelector<NowPlayingComponent>(fixture, '.title')).toBe(input.streamInfo.title);
    expect(getElementTextBySelector<NowPlayingComponent>(fixture, '.bitrate')).toBe(`Bitrate: ${input.streamInfo.bitrate}`);
  });

  const streamInfoStatusTemplateInput = [
    {
      station: new Station(),
      streamInfo: new StreamInfo(null, null),
      playerStatus: PlayerStatus.LoadingAudio,
      streamInfoStatus: StreamInfoStatus.NotInitialized,
      expected: 'Loading Audio...'
    },
    {
      station: new Station(),
      streamInfo: new StreamInfo(null, null),
      playerStatus: PlayerStatus.Playing,
      streamInfoStatus: StreamInfoStatus.NotInitialized,
      expected: ''
    },
    {
      station: new Station(),
      streamInfo: new StreamInfo(null, null),
      playerStatus: PlayerStatus.Playing,
      streamInfoStatus: StreamInfoStatus.LoadingStreamInfo,
      expected: ''
    },
    {
      station: new Station(),
      streamInfo: new StreamInfo('Valid Title', null),
      playerStatus: PlayerStatus.Playing,
      streamInfoStatus: StreamInfoStatus.Valid,
      expected: 'Valid Title'
    },
    {
      station: new Station(),
      streamInfo: new StreamInfo(null, null),
      playerStatus: PlayerStatus.Playing,
      streamInfoStatus: StreamInfoStatus.Error,
      expected: ''
    },
    {
      station: new Station(),
      streamInfo: null,
      playerStatus: PlayerStatus.Playing,
      streamInfoStatus: StreamInfoStatus.LoadingStreamInfo,
      expected: 'Loading Stream Info...'
    },
    {
      station: new Station(),
      streamInfo: null,
      playerStatus: PlayerStatus.Playing,
      streamInfoStatus: StreamInfoStatus.Error,
      expected: 'Metadata Unavailable'
    },
  ];
  theoretically.it('should reflect the various streamInfoStatus states properly in the template',
    streamInfoStatusTemplateInput, (input) => {
    // Act
    store.setState({
      ...initialRootState,
      player: {
        ...initialPlayerState,
        currentStation: input.station,
        streamInfo: input.streamInfo,
        streamInfoStatus: input.streamInfoStatus,
        playerStatus: input.playerStatus
      }
    });
    fixture.detectChanges();

    // Assert: Ensure that the text of the title element conveys the current stream status
    expect(getElementTextBySelector<NowPlayingComponent>(fixture, '.title')).toBe(input.expected);
  });

  const nonEmptyBitrateInput = [
    {
      station: new Station(),
      streamInfo: new StreamInfo(null, null),
      streamInfoStatus: StreamInfoStatus.Valid
    },
    {
      station: new Station(),
      streamInfo: new StreamInfo(null, null, ''),
      streamInfoStatus: StreamInfoStatus.Valid
    },
    {
      station: new Station(),
      streamInfo: new StreamInfo(null, null, '128'),
      streamInfoStatus: StreamInfoStatus.Valid
    }
  ];
  theoretically.it('should only display bitrate when a non-empty value is present', nonEmptyBitrateInput, (input) => {
    // Act
    store.setState({
      ...initialRootState,
      player: {
        ...initialPlayerState,
        currentStation: input.station,
        streamInfo: input.streamInfo,
        streamInfoStatus: input.streamInfoStatus
      }
    });
    fixture.detectChanges();

    // Assert: Ensure that the bitrate is displayed if not blank and not shown at all if it is blank
    if (!isBlank(input.streamInfo.bitrate)) {
      expect(getElementTextBySelector<NowPlayingComponent>(fixture, '.bitrate')).toBe(`Bitrate: ${input.streamInfo.bitrate}`);
    } else {
      expect(getElementBySelector<NowPlayingComponent>(fixture, '.bitrate')).toBeNull();
    }
  });

  it('should update the template to reflect changes in minutes until sleep', () => {
    // Arrange: Emit an empty nowPlaying so that the 'selected' template is rendered
    let state = {
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
      // Act
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
      expect(getElementTextBySelector<NowPlayingComponent>(fixture, '.minutes-until-sleep')).toBe(`Sleeping in ${i} minutes`);
    }

    /* Clear the sleep timer and ensure that 'minutes until sleep' is
    removed from the template accordingly. */
    state = {
      ...state,
      sleepTimer: {
        ...state.sleepTimer,
        minutesUntilSleep: null
      }
    };
    store.setState(state);
    fixture.detectChanges();
    expect(getElementBySelector<NowPlayingComponent>(fixture, '.minutes-until-sleep')).toBeNull();
  });

  it('should update the template to reflect changes in the keepAwake state', () => {
    // Arrange
    store.setState({
      ...initialRootState,
      player: {
        ...initialPlayerState,
        currentStation: new Station(),
        streamInfo: new StreamInfo(null, null),
        streamInfoStatus: StreamInfoStatus.Valid
      }
    });
    // Set up a sequence of dummy boolean $enabled values to iterate through
    const testEntries = [ false, true, false, true, false ];

    testEntries.forEach(enabled => {
      // Act: Emit the test entry and detect changes to update the template
      keepAwakeServiceSpy.enabled$.next(enabled);
      fixture.detectChanges();
      const keepAwakeButtonText = getElementTextBySelector<NowPlayingComponent>(fixture, 'li.keep-awake button');
      // If we turned on keepAwake
      if (enabled) {
        /* The keepawake div should be rendered with the text 'Keeping Awake'
        and the disable button should be shown. */
        const keepAwakeDiv = getElementBySelector<NowPlayingComponent>(fixture, 'div.keep-awake');
        expect(keepAwakeDiv).not.toBeNull();
        expect(keepAwakeDiv.innerText).toBe('Keeping Awake');
        expect(keepAwakeButtonText).toBe('Disable Keep Awake');
      } else {
        // The keepAwake div should *not* be shown and the enable button *should* be shown
        expect(getElementBySelector<NowPlayingComponent>(fixture, 'div.keep-awake')).toBeNull();
        expect(keepAwakeButtonText).toBe('Enable Keep Awake');
      }
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
    // Create a helper function to retrieve the play button text in a less verbose manner
    const getPlayPauseBtnText = () => getElementTextBySelector<NowPlayingComponent>(fixture, 'li.play-pause button');
    // The 'Play' button should be drawn initially before we start to play something
    expect(getPlayPauseBtnText()).toBe('Play');

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

    expect(getPlayPauseBtnText()).toBe('Pause');

    state = {
      ...state,
      player: {
        ...state.player,
        playerStatus: PlayerStatus.Stopped
      }
    };
    store.setState(state);
    fixture.detectChanges();

    expect(getPlayPauseBtnText()).toBe('Play');
  });
});
