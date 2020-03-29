import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PlayerBarStationInfoComponent } from './player-bar-station-info.component';
import { NowPlaying, Station, StreamInfo, StreamInfoStatus } from '@core';
import { getElementTextBySelector } from '@utilities/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { RootState, initialRootState } from '@root-state';
import { initialPlayerState } from '@root-state/player';
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
    new NowPlaying(new Station(), new StreamInfo(null, null), StreamInfoStatus.NotInitialized),
    new NowPlaying(new Station(), new StreamInfo(null, null), StreamInfoStatus.LoadingStreamInfo),
    new NowPlaying(new Station(), new StreamInfo('Valid Title', null), StreamInfoStatus.Valid),
    new NowPlaying(new Station(), new StreamInfo(null, null), StreamInfoStatus.Error),
  ];
  theoretically.it('should reflect the various streamInfoStatus states properly in the template', streamInfoStatusTemplateInput, (input) => {
    // Act: Bind this iteration's NowPlaying entry and detect changes
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
    // Assert: Ensure that the text of the title element conveys the current stream status
    const titleText = getElementTextBySelector<PlayerBarStationInfoComponent>(fixture, '.title');
    switch (input.streamInfoStatus) {
      case StreamInfoStatus.NotInitialized:
        expect(titleText).toBe('');
        break;
      case StreamInfoStatus.LoadingStreamInfo:
        expect(titleText).toBe('Loading Stream Info...');
        break;
      case StreamInfoStatus.Valid:
        expect(titleText).toBe(input.streamInfo.title);
        break;
      case StreamInfoStatus.Error:
        expect(titleText).toBe('Metadata Unavailable');
        break;
    }
  });
});
