import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PlayerBarStationInfoComponent } from './player-bar-station-info.component';
import { getElementTextBySelector } from '@utilities/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { RootState, initialRootState } from '@core';
import { initialPlayerState, Station, StreamInfo, StreamInfoStatus, PlayerStatus } from '@core/models/player';
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
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
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
    // Act: Bind this iteration's NowPlaying entry and detect changes
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
    expect(getElementTextBySelector<PlayerBarStationInfoComponent>(fixture, '.title')).toBe(input.expected);
  });
});
