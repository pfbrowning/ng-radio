import { ComponentFixture, TestBed, async, fakeAsync, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { NowPlayingComponent } from './now-playing.component';
import { RouterTestingModule } from '@angular/router/testing';
import { PlayerService, CoreRadioLogicModule, NowPlaying, Station, StreamInfo, StreamInfoStatus } from '@modules/core/core-radio-logic/core-radio-logic.module';
import { createPlayerServiceSpy } from '@modules/core/core-radio-logic/testing/core-radio-logic-spy-factories.spec';
import { NotificationsSpyFactories } from '@modules/core/notifications/testing/notifications-spy-factories.spec';
import { MatMenuModule } from '@angular/material/menu';
import { SharedComponentsModule } from '@modules/shared/shared-components/shared-components.module';
import { NotificationService } from '@modules/core/notifications/notifications.module';
import { KeepAwakeService } from '@modules/core/keep-awake/keep-awake.module';
import { ModalManagerModule } from '@browninglogic/ng-modal';
import { MatInputModule } from '@angular/material/input';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { createKeepAwakeServiceSpy } from '@modules/core/keep-awake/testing/keep-awake-spy-factories.spec';
import { getElementBySelector, getElementTextBySelector } from '@test-helpers';


describe('NowPlayingComponent', () => {
  let component: NowPlayingComponent;
  let fixture: ComponentFixture<NowPlayingComponent>;
  let playerService: any;

  beforeEach(async(() => {
    playerService = createPlayerServiceSpy();

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
        CoreRadioLogicModule,
        SharedComponentsModule
      ],
      providers: [
        { provide: PlayerService, useValue: playerService },
        { provide: NotificationService, useValue: NotificationsSpyFactories.CreateNotificationServiceSpy() },
        { provide: KeepAwakeService, useValue: createKeepAwakeServiceSpy() }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NowPlayingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update the template to reflect changes in nowPlaying metadata', fakeAsync(() => {
    // Arrange: Define a few dummy NowPlaying entries
    const testEntries = [
      new NowPlaying(
        new Station('station title', 'http://url.com', 'station genre', 'http://icon.com/'), 
        new StreamInfo('stream title', 'stream source', '128', 'station title from stream', 'stream description', 'stream genre'), 
        StreamInfoStatus.Valid
      ),
      new NowPlaying(
        new Station('station title 2', 'http://url2.com', 'station genre 2', 'http://icon2.com/'), 
        new StreamInfo('stream title 2', 'stream source 2', '256', 'station title from stream 2', 'stream description 2', 'stream genre 2'), 
        StreamInfoStatus.Valid
      ),
      new NowPlaying(
        new Station('another station title', 'http://anotherurl.com', 'another station genre', 'http://anothericon.com/'), 
        new StreamInfo('another stream title', 'another stream source', '64', 'another station title from stream', 'another stream description', 'another stream genre'), 
        StreamInfoStatus.Valid
      ),
      new NowPlaying(
        new Station('Radio Caprice: Speed Metal', 'http://radiocapricespeedmetal.com', 'Speed Metal', 'http://icon4.com/'), 
        new StreamInfo('Radio Caprice Stream', 'radio caprice source', '48', 'stream station title', 'Awesome, obscure speed metal station', 'Speed Metal Stream'), 
        StreamInfoStatus.Valid
      )
    ];

    testEntries.forEach(nowPlaying => {
      // Act: Emit this iteration's NowPlaying entry and pause for the template to catch up
      playerService.nowPlaying$.next(nowPlaying);
      tick(0);
      // Assert: Ensure that the important NowPlaying properties were properly bound to the template
      expect(getElementBySelector<NowPlayingComponent>(fixture, '.station-icon').src).toBe(nowPlaying.station.iconUrl);
      expect(getElementTextBySelector<NowPlayingComponent>(fixture, '.stationTitle')).toBe(nowPlaying.station.title);
      expect(getElementTextBySelector<NowPlayingComponent>(fixture, '.title')).toBe(nowPlaying.streamInfo.title);
      expect(getElementTextBySelector<NowPlayingComponent>(fixture, '.bitrate')).toBe(`Bitrate: ${nowPlaying.streamInfo.bitrate}`);
    });
  }));

  it('should properly reflect the various streamInfoStatus states properly in the template', () => {
    // TODO write this test
  });

  it('should only display bitrate when a non-empty value is present for bitrate', () => {
    // TODO write this test
  })

  it('should update the template to reflect changes in minutes until sleep', () => {
    // TODO write this test
  });

  it('should update the template to reflect changes in the keepAwake state', () => {
    // TODO write this test
  });

  it('should update the pause button on global play & pause', () => {
    // TODO write this test
  })

  it('should set and cancel the sleep timer accordingly when a value is selected', () => {
    // TODO write this test
  });
});
