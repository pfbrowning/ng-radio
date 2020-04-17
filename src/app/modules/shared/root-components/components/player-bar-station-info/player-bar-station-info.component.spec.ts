import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PlayerBarStationInfoComponent } from './player-bar-station-info.component';
import { getElementTextBySelector } from '@utilities/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { RootState, initialRootState } from '@core';
import { Station, StreamInfoStatus, PlayerStatus, NowPlaying } from '@core/models/player';
import { PlayerSelectors } from '@core/store/player';
import theoretically from 'jasmine-theories';

describe('PlayerBarStationInfoComponent', () => {
  let component: PlayerBarStationInfoComponent;
  let fixture: ComponentFixture<PlayerBarStationInfoComponent>;
  let store: MockStore<RootState>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlayerBarStationInfoComponent ],
      providers: [
        provideMockStore({initialState: initialRootState})
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerBarStationInfoComponent);
    store = TestBed.inject(MockStore);
    component = fixture.componentInstance;
    component.currentStation = new Station();
  });

  afterEach(() => {
    store.resetSelectors();
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  const streamInfoStatusTemplateInput = [
    {
      nowPlaying: new NowPlaying(null, null),
      playerStatus: PlayerStatus.LoadingAudio,
      streamInfoStatus: StreamInfoStatus.NotInitialized,
      expected: 'Loading Audio...'
    },
    {
      nowPlaying: new NowPlaying(null, null),
      playerStatus: PlayerStatus.Playing,
      streamInfoStatus: StreamInfoStatus.NotInitialized,
      expected: ''
    },
    {
      station: new Station(),
      nowPlaying: new NowPlaying(null, null),
      playerStatus: PlayerStatus.Playing,
      streamInfoStatus: StreamInfoStatus.LoadingStreamInfo,
      expected: ''
    },
    {
      nowPlaying: new NowPlaying('Valid Title', null),
      playerStatus: PlayerStatus.Playing,
      streamInfoStatus: StreamInfoStatus.Valid,
      expected: 'Valid Title'
    },
    {
      nowPlaying: new NowPlaying(null, null),
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
      nowPlaying: null,
      playerStatus: PlayerStatus.Playing,
      streamInfoStatus: StreamInfoStatus.Error,
      expected: 'Metadata Unavailable'
    },
  ];
  theoretically.it('should reflect the various streamInfoStatus states properly in the template',
    streamInfoStatusTemplateInput, (input) => {
    // Arrange & Act
    component.currentPlayerStatus = input.playerStatus;
    store.overrideSelector(PlayerSelectors.selectCurrentNowPlaying, input.nowPlaying);
    store.overrideSelector(PlayerSelectors.selectCurrentStreamInfoStatus, input.streamInfoStatus);
    store.refreshState();
    fixture.detectChanges();

    // Assert: Ensure that the text of the title element conveys the current stream status
    expect(getElementTextBySelector<PlayerBarStationInfoComponent>(fixture, '.title')).toBe(input.expected);
  });
});
