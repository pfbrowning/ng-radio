import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PlayerBarStationInfoComponent } from './player-bar-station-info.component';
import { getElementTextBySelector } from '@utilities/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { RootState, initialRootState } from '@core';
import { Station, StreamInfoStatus, PlayerStatus, NowPlaying } from '@core/models/player';
import { PlayerSelectors } from '@core/store';
import { SharedModule } from '@shared';
import theoretically from 'jasmine-theories';

describe('PlayerBarStationInfoComponent', () => {
  let component: PlayerBarStationInfoComponent;
  let fixture: ComponentFixture<PlayerBarStationInfoComponent>;
  let store: MockStore<RootState>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlayerBarStationInfoComponent ],
      imports: [
        SharedModule
      ],
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
    component.currentPlayerStatus = input.playerStatus;
    component.validatingCurrent = input.validating;
    store.overrideSelector(PlayerSelectors.currentStreamInfo, input.streamInfo);
    store.refreshState();
    fixture.detectChanges();

    // Assert: Ensure that the text of the title element conveys the current stream status
    expect(getElementTextBySelector<PlayerBarStationInfoComponent>(fixture, '.title')).toBe(input.expected);
  });
});
