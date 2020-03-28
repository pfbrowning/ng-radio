import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PlayerBarStationInfoComponent } from './player-bar-station-info.component';
import { NowPlaying, Station, StreamInfo, StreamInfoStatus } from '@core-radio-logic';
import { getElementTextBySelector } from '@utilities/testing';

describe('PlayerBarStationInfoComponent', () => {
  let component: PlayerBarStationInfoComponent;
  let fixture: ComponentFixture<PlayerBarStationInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlayerBarStationInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerBarStationInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should reflect the various streamInfoStatus states properly in the template', () => {
    // Arrange: Define a dummy NowPlaying entry for each StreamInfoStatus
    const testEntries = [
      new NowPlaying(new Station(), new StreamInfo(null, null), StreamInfoStatus.NotInitialized),
      new NowPlaying(new Station(), new StreamInfo(null, null), StreamInfoStatus.LoadingAudio),
      new NowPlaying(new Station(), new StreamInfo(null, null), StreamInfoStatus.LoadingStreamInfo),
      new NowPlaying(new Station(), new StreamInfo('Valid Title', null), StreamInfoStatus.Valid),
      new NowPlaying(new Station(), new StreamInfo(null, null), StreamInfoStatus.Error),
    ];

    testEntries.forEach(nowPlaying => {
      // Act: Bind this iteration's NowPlaying entry and detect changes
      fixture.componentInstance.nowPlaying = nowPlaying;
      fixture.detectChanges();
      // Assert: Ensure that the text of the title element conveys the current stream status
      const titleText = getElementTextBySelector<PlayerBarStationInfoComponent>(fixture, '.title');
      switch (nowPlaying.streamInfoStatus) {
        case StreamInfoStatus.NotInitialized:
          expect(titleText).toBe('');
          break;
        case StreamInfoStatus.LoadingAudio:
          expect(titleText).toBe('Loading Audio...');
          break;
        case StreamInfoStatus.LoadingStreamInfo:
          expect(titleText).toBe('Loading Stream Info...');
          break;
        case StreamInfoStatus.Valid:
          expect(titleText).toBe(nowPlaying.streamInfo.title);
          break;
        case StreamInfoStatus.Error:
          expect(titleText).toBe('Metadata Unavailable');
          break;
      }
    });
  });
});
