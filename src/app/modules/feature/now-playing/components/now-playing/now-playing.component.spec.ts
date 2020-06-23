import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { NowPlayingComponent } from './now-playing.component';
import { RouterTestingModule } from '@angular/router/testing';
import { KeepAwakeService } from '@core';
import { MatMenuModule } from '@angular/material/menu';
import { MatInputModule } from '@angular/material/input';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { getElementBySelector, getElementTextBySelector } from '@utilities/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { initialRootState, RootState } from '@core';
import { SharedModule } from '@shared';
import { PlayerStatus, initialPlayerState, Station, StreamInfoStatus, NowPlaying } from '@core/models/player';
import { PlayerSelectors } from '@core/store';
import { CoreSpyFactories } from '@core/testing';
import isBlank from 'is-blank';
import theoretically from 'jasmine-theories';


describe('NowPlayingComponent', () => {
  let component: NowPlayingComponent;
  let fixture: ComponentFixture<NowPlayingComponent>;
  let keepAwakeServiceSpy: any;
  let store: MockStore<RootState>;

  beforeEach(async(() => {
    keepAwakeServiceSpy = CoreSpyFactories.createKeepAwakeServiceSpy();

    TestBed.configureTestingModule({
      declarations: [
        NowPlayingComponent
      ],
      imports: [
        RouterTestingModule,
        MatMenuModule,
        MatFormFieldModule,
        MatInputModule,
        NoopAnimationsModule,
        FormsModule,
        SharedModule
      ],
      providers: [
        { provide: KeepAwakeService, useValue: keepAwakeServiceSpy },
        provideMockStore({ initialState: initialRootState }),
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NowPlayingComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
  });

  afterEach(() => {
    store.resetSelectors();
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  const nowPlayingTemplateInput = [
    {
      station: new Station(null, 'station title', 'http://url.com', 'station genre', 'http://icon.com/'),
      nowPlaying: new NowPlaying('stream title', 'stream source', '128', 'station title from stream', 'stream description', 'stream genre'),
      streamInfoStatus: StreamInfoStatus.Valid
    },
    {
      station: new Station(null, 'station title 2', 'http://url2.com', 'station genre 2', 'http://icon2.com/'),
      nowPlaying: new NowPlaying('stream title 2', 'stream source 2', '256', 'station title from stream 2', 'stream description 2', 'stream genre 2'),
      streamInfoStatus: StreamInfoStatus.Valid
    },
    {
      station: new Station(null, 'another station title', 'http://anotherurl.com', 'another station genre', 'http://anothericon.com/'),
      nowPlaying: new NowPlaying('stream 3', 'another stream source', '64', 'station 3', 'another stream description', 'another stream genre'),
      streamInfoStatus: StreamInfoStatus.Valid
    },
    {
      station: new Station(null, 'Radio Caprice: Speed Metal', 'http://radiocapricespeedmetal.com', 'Speed Metal', 'http://icon4.com/'),
      nowPlaying: new NowPlaying(
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
        streamInfo: {
          ...initialPlayerState.streamInfo,
          current: {
            nowPlaying: input.nowPlaying,
            status: input.streamInfoStatus
          },
        },
        playerStatus: PlayerStatus.Playing
      }
    });
    fixture.detectChanges();

    // Assert: Ensure that the important NowPlaying properties were properly bound to the template
    expect(getElementBySelector<NowPlayingComponent>(fixture, '.station-icon').src).toBe(input.station.iconUrl);
    expect(getElementTextBySelector<NowPlayingComponent>(fixture, '.station-title')).toBe(input.station.title);
    expect(getElementTextBySelector<NowPlayingComponent>(fixture, '.title')).toBe(input.nowPlaying.title);
    expect(getElementTextBySelector<NowPlayingComponent>(fixture, '.bitrate')).toBe(`Bitrate: ${input.nowPlaying.bitrate}`);
  });


  const playerStatusTemplateInput = [
    {
      playerStatus: PlayerStatus.LoadingAudio,
      validating: false,
      expected: 'Loading Audio...'
    },
    {
      playerStatus: PlayerStatus.Stopped,
      validating: false,
      expected: ''
    },
    {
      playerStatus: PlayerStatus.Stopped,
      validating: true,
      expected: 'Validating Stream...'
    },
    {
      streamInfo: {
        nowPlaying: new NowPlaying('Valid Title', null),
        status: StreamInfoStatus.Valid
      },
      playerStatus: PlayerStatus.Playing,
      expected: 'Valid Title'
    },
  ];
  theoretically.it('should reflect the various player states properly in the template',
    playerStatusTemplateInput, (input) => {
    // Arrange & Act
    store.overrideSelector(PlayerSelectors.selectCurrentStation, new Station());
    store.overrideSelector(PlayerSelectors.currentStreamInfo, input.streamInfo);
    store.overrideSelector(PlayerSelectors.selectPlayerStatus, input.playerStatus);
    store.overrideSelector(PlayerSelectors.selectIsValidationInProgressForCurrentStation, input.validating);
    store.refreshState();
    fixture.detectChanges();

    // Assert: Ensure that the text of the title element conveys the current stream status
    expect(getElementTextBySelector<NowPlayingComponent>(fixture, '.title')).toBe(input.expected);
  });

  const nonEmptyBitrateInput = [
    {
      station: new Station(),
      nowPlaying: new NowPlaying(null, null),
      streamInfoStatus: StreamInfoStatus.Valid
    },
    {
      station: new Station(),
      nowPlaying: new NowPlaying(null, null, ''),
      streamInfoStatus: StreamInfoStatus.Valid
    },
    {
      station: new Station(),
      nowPlaying: new NowPlaying(null, null, '128'),
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
        streamInfo: {
          ...initialPlayerState.streamInfo,
          current: {
            nowPlaying: input.nowPlaying,
            status: input.streamInfoStatus
          },
        },
        playerStatus: PlayerStatus.Playing
      }
    });
    fixture.detectChanges();

    // Assert: Ensure that the bitrate is displayed if not blank and not shown at all if it is blank
    if (!isBlank(input.nowPlaying.bitrate)) {
      expect(getElementTextBySelector<NowPlayingComponent>(fixture, '.bitrate')).toBe(`Bitrate: ${input.nowPlaying.bitrate}`);
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
        streamInfo: {
          ...initialPlayerState.streamInfo,
          current: {
            nowPlaying: new NowPlaying(null, null),
            status: StreamInfoStatus.Valid
          },
        },
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
        streamInfo: {
          ...initialPlayerState.streamInfo,
          current: {
            nowPlaying: new NowPlaying(null, null),
            status: StreamInfoStatus.Valid
          },
        },
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
});
