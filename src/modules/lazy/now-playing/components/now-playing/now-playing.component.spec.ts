import { ComponentFixture, TestBed, async, fakeAsync, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { NowPlayingComponent } from './now-playing.component';
import { RouterTestingModule } from '@angular/router/testing';
import { PlayerService, CoreRadioLogicModule, NowPlaying,
  Station, StreamInfo, StreamInfoStatus, SleepTimerService } from '@modules/core/core-radio-logic/core-radio-logic.module';
import { createPlayerServiceSpy, createSleepTimerServiceSpy
  } from '@modules/core/core-radio-logic/testing/core-radio-logic-spy-factories.spec';
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
import isBlank from 'is-blank';


describe('NowPlayingComponent', () => {
  let component: NowPlayingComponent;
  let fixture: ComponentFixture<NowPlayingComponent>;
  let playerService: any;
  let sleepTimerService: any;
  let keepAwakeServiceSpy: any;

  beforeEach(async(() => {
    playerService = createPlayerServiceSpy();
    sleepTimerService = createSleepTimerServiceSpy();
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
        CoreRadioLogicModule,
        SharedComponentsModule
      ],
      providers: [
        { provide: PlayerService, useValue: playerService },
        { provide: NotificationService, useValue: NotificationsSpyFactories.CreateNotificationServiceSpy() },
        { provide: KeepAwakeService, useValue: keepAwakeServiceSpy },
        { provide: SleepTimerService, useValue: sleepTimerService }
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
      // Act: Emit this iteration's NowPlaying entry and pause for the template to catch up
      playerService.nowPlaying$.next(nowPlaying);
      tick(0);
      // Assert: Ensure that the important NowPlaying properties were properly bound to the template
      expect(getElementBySelector<NowPlayingComponent>(fixture, '.station-icon').src).toBe(nowPlaying.station.iconUrl);
      expect(getElementTextBySelector<NowPlayingComponent>(fixture, '.station-title')).toBe(nowPlaying.station.title);
      expect(getElementTextBySelector<NowPlayingComponent>(fixture, '.title')).toBe(nowPlaying.streamInfo.title);
      expect(getElementTextBySelector<NowPlayingComponent>(fixture, '.bitrate')).toBe(`Bitrate: ${nowPlaying.streamInfo.bitrate}`);
    });
  }));

  it('should reflect the various streamInfoStatus states properly in the template', fakeAsync(() => {
    // Arrange: Define a dummy NowPlaying entry for each StreamInfoStatus
    const testEntries = [
      new NowPlaying(new Station(), new StreamInfo(null, null), StreamInfoStatus.NotInitialized),
      new NowPlaying(new Station(), new StreamInfo(null, null), StreamInfoStatus.LoadingAudio),
      new NowPlaying(new Station(), new StreamInfo(null, null), StreamInfoStatus.LoadingStreamInfo),
      new NowPlaying(new Station(), new StreamInfo('Valid Title', null), StreamInfoStatus.Valid),
      new NowPlaying(new Station(), new StreamInfo(null, null), StreamInfoStatus.Error),
    ];

    testEntries.forEach(nowPlaying => {
      // Act: Emit this iteration's NowPlaying entry and pause for the template to catch up
      playerService.nowPlaying$.next(nowPlaying);
      tick(0);
      // Assert: Ensure that the text of the title element conveys the current stream status
      const titleText = getElementTextBySelector<NowPlayingComponent>(fixture, '.title');
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
  }));

  it('should only display bitrate when a non-empty value is present', fakeAsync(() => {
    // Arrange: Put together a few dummy entries with blank and non-blank bitrates
    const testEntries = [
      new NowPlaying(new Station(), new StreamInfo(null, null), StreamInfoStatus.Valid),
      new NowPlaying(new Station(), new StreamInfo(null, null, ''), StreamInfoStatus.Valid),
      new NowPlaying(new Station(), new StreamInfo(null, null, '128'), StreamInfoStatus.Valid),
    ];

    testEntries.forEach(nowPlaying => {
      // Act: Emit this iteration's NowPlaying entry and pause for the template to catch up
      playerService.nowPlaying$.next(nowPlaying);
      tick(0);

      // Assert: Ensure that the bitrate is displayed if not blank and not shown at all if it is blank
      if (!isBlank(nowPlaying.streamInfo.bitrate)) {
        expect(getElementTextBySelector<NowPlayingComponent>(fixture, '.bitrate')).toBe(`Bitrate: ${nowPlaying.streamInfo.bitrate}`);
      } else {
        expect(getElementBySelector<NowPlayingComponent>(fixture, '.bitrate')).toBeNull();
      }
    });
  }));

  it('should update the template to reflect changes in minutes until sleep', () => {
    // Arrange: Emit an empty nowPlaying so that the 'selected' template is rendered
    playerService.nowPlaying$.next(new NowPlaying(new Station(), new StreamInfo(null, null), StreamInfoStatus.Valid));

    for (let i = 300; i >= 0; i--) {
      // Act: Emit a new minutesUntilSleep value and detect changes
      sleepTimerService.minutesUntilSleep$.next(i);
      fixture.detectChanges();
      // Assert: Ensure that the new value was rendered properly in the template
      expect(getElementTextBySelector<NowPlayingComponent>(fixture, '.minutes-until-sleep')).toBe(`Sleeping in ${i} minutes`);
    }

    /* Clear the sleep timer and ensure that 'minutes until sleep' is
    removed from the template accordingly. */
    sleepTimerService.minutesUntilSleep$.next(null);
    fixture.detectChanges();
    expect(getElementBySelector<NowPlayingComponent>(fixture, '.minutes-until-sleep')).toBeNull();
  });

  it('should update the template to reflect changes in the keepAwake state', () => {
    // Arrange
    // Emit an empty nowPlaying so that the 'selected' template is rendered
    playerService.nowPlaying$.next(new NowPlaying(new Station(), new StreamInfo(null, null), StreamInfoStatus.Valid));
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

  it('should update the pause button on global play & pause', fakeAsync(() => {
    // Arrange
    // Emit an empty nowPlaying entry and detect changes to render the 'selected' template.
    playerService.nowPlaying$.next(new NowPlaying(new Station(), new StreamInfo(null, null), StreamInfoStatus.Valid));
    fixture.detectChanges();
    // Create a helper function to retrieve the play button text in a less verbose manner
    const getPlayPauseBtnText = () => getElementTextBySelector<NowPlayingComponent>(fixture, 'li.play-pause button');
    // The 'Play' button should be drawn initially before we start to play something
    expect(getPlayPauseBtnText()).toBe('Play');

    /* Act & Assert: Simulate a play & pause action and ensure that the correct button
    is rendered in the template accordingly. */
    playerService.paused$.next(false);
    tick();

    expect(getPlayPauseBtnText()).toBe('Pause');

    playerService.paused$.next(true);
    tick();

    expect(getPlayPauseBtnText()).toBe('Play');
  }));
});
