import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { PlayerService } from './player.service';
import { ConfigService } from '@modules/config/config.module';
import { ConfigSpyFactories } from '@modules/config/testing/config-spy-factories.spec';
import { SpyFactories } from 'src/app/testing/spy-factories.spec';
import { StreamInfoService } from './stream-info.service';
import { NotificationService, Severities } from 'src/app/services/notification.service';
import { AudioElementToken, Station, CoreRadioLogicModule } from '@modules/core-radio-logic/core-radio-logic.module';
import { AudioElementStub } from '@modules/core-radio-logic/testing/AudioElementStub.spec';
import { StreamInfoServiceStub } from '@modules/core-radio-logic/testing/StreamInfoServiceStub.spec';
import { NowPlaying } from '../models/now-playing';
import { StreamInfo } from '../models/stream-info';
import { Title } from '@angular/platform-browser';
import { LoggingService } from 'src/app/services/logging.service';
import { StreamInfoStatus } from '../models/stream-info-status';
import isBlank from 'is-blank';

describe('PlayerService', () => {
  let playerService: PlayerService;
  let titleService: Title;
  let audioPausedSpy: jasmine.Spy;
  let notificationServiceSpy: jasmine.SpyObj<NotificationService>;
  let loggingServiceSpy: jasmine.SpyObj<LoggingService>;
  let streamInfoService: StreamInfoServiceStub;
  let configServiceSpy: jasmine.SpyObj<ConfigService>;
  let audioElement: AudioElementStub;
  let audioElementPlaySpy: jasmine.Spy;
  let audioElementPauseSpy: jasmine.Spy;
  let nowPlayingSpy: jasmine.Spy;

  beforeEach(() => {
    audioElement = new AudioElementStub();
    notificationServiceSpy = SpyFactories.CreateNotificationServiceSpy();
    configServiceSpy = ConfigSpyFactories.CreateConfigServiceSpy();
    loggingServiceSpy = SpyFactories.CreateLoggingServiceSpy();

    TestBed.configureTestingModule({
      imports: [
        CoreRadioLogicModule
      ],
      providers: [
        { provide: ConfigService, useValue: configServiceSpy },
        { provide: StreamInfoService, useClass: StreamInfoServiceStub },
        { provide: NotificationService, useValue: notificationServiceSpy },
        { provide: AudioElementToken, useValue: audioElement },
        { provide: LoggingService, useValue: loggingServiceSpy }
      ]
    });
    playerService = TestBed.get(PlayerService);
    titleService = TestBed.get(Title);
    streamInfoService = TestBed.get(StreamInfoService);
    audioPausedSpy = jasmine.createSpy('audioPaused');
    nowPlayingSpy = jasmine.createSpy('nowPlaying');
    audioElementPauseSpy = spyOn(audioElement, 'pause').and.callThrough();
    audioElementPlaySpy = spyOn(audioElement, 'play').and.callThrough();
    playerService.paused.subscribe(paused => audioPausedSpy(paused));
    playerService.nowPlaying$.subscribe(nowPlaying => nowPlayingSpy(nowPlaying));
  });

  it('should be created', () => {
    expect(playerService).toBeTruthy();
  });

  it('should properly handle audio error', () => {
    /* Arrange: Ensure that neither notify or logException have been called */
    expect(notificationServiceSpy.notify).not.toHaveBeenCalled();
    expect(loggingServiceSpy.logException).not.toHaveBeenCalled();
    // Act: Emit an audio error
    audioElement.error.emit('some error');
    // Assert: Ensure that notify was called as expected and that the error was logged
    expect(notificationServiceSpy.notify).toHaveBeenCalledTimes(1);
    expect(notificationServiceSpy.notify.calls.mostRecent().args)
      .toEqual([Severities.Error, 'Failed to play audio', 'Failed to play undefined']);
    expect(loggingServiceSpy.logException).toHaveBeenCalledTimes(1);
  });

  it('should properly report paused status', () => {
    // The audioElement is paused on initialization
    expect(audioPausedSpy.calls.mostRecent().args[0]).toBe(true);
    // Play the audioElement directly
    audioElement.play();
    // Pause state should be false
    expect(audioPausedSpy.calls.mostRecent().args[0]).toBe(false);
    // Pause the audioElement directly
    audioElement.pause();
    // Pause state should be false
    expect(audioPausedSpy.calls.mostRecent().args[0]).toBe(true);
  });

  it('should properly change stations', () => {
    // Arrange: Set up some dummy test data
    const testEntries = [
      new Station('station 1', 'url 1', 'genre 1', 'someicon.jpg', null),
      new Station('another station', 'http://79.111.119.111:9107/;', 'Speed Metal', null, ['tag 1', 'another tag']),
      new Station('Radio Metal On: The Thrasher', 'http://188.165.212.92:8020/thrasher128mp3',
        'Thrash Metal', 'http://metalon.org/wordpress/wp-content/uploads/2016/06/cropped-metalon-logo-2-270x270.jpg'),
      new Station('WQXR', 'http://stream.wqxr.org/wqxr')
    ];

    let iteration = 0;
    // For each test entry
    testEntries.forEach(testEntry => {
      // Arrange: Ensure that the audio hasn't been paused or played yet for this iteration
      expect(audioElementPauseSpy).toHaveBeenCalledTimes(iteration);
      expect(audioElementPlaySpy).toHaveBeenCalledTimes(iteration);

      // Act: call playStation with the new station
      playerService.playStation(testEntry);

      // Assert
      // Ensure that the audio was paused and played once for this iteration
      expect(audioElementPauseSpy).toHaveBeenCalledTimes(iteration + 1);
      expect(audioElementPlaySpy).toHaveBeenCalledTimes(iteration + 1);
      // Ensure that the audio url was updated
      expect(playerService.source).toBe(testEntry.url);

      // Ensure that the appropriate NowPlaying data was emitted by the BehaviorSubject
      expect(nowPlayingSpy.calls.mostRecent().args[0].station).toBe(testEntry);

      iteration++;
    });

    // Assert: The audio should have been played once for each test entry
    expect(audioElementPlaySpy).toHaveBeenCalledTimes(testEntries.length);
  });

  it('should properly load initial metadata', () => {
    // Arrange
    // Set up our dummy station
    const testStation = new Station('Station Title', 'station url');
    // The audio element should not have been played or paused yet
    expect(audioElementPauseSpy).not.toHaveBeenCalled();
    expect(audioElementPlaySpy).not.toHaveBeenCalled();

    // Act: Play our test station
    playerService.playStation(testStation);
    // Assert
    /* Between the init of loadMetadata and the return of metadata,
    the emitted NowPlaying should be in a Loading state */
    expect(nowPlayingSpy.calls.mostRecent().args[0].streamInfo).toBeNull();
    expect(nowPlayingSpy.calls.mostRecent().args[0].streamInfoStatus).toBe(StreamInfoStatus.Loading);
    // pause and play should have been called on the audio element once by this point
    expect(audioElementPauseSpy).toHaveBeenCalledTimes(1);
    expect(audioElementPlaySpy).toHaveBeenCalledTimes(1);

    // Emit dummy metadata
    streamInfoService.flushMetadata(new StreamInfo('Test Song', 'dummy fetchsource'));
    // Upon emit of metadata with title of 'Test Song, nowPlaying should have emitted a matching title
    expect(nowPlayingSpy.calls.mostRecent().args[0].streamInfo.title).toBe('Test Song');
    // The document title should have also been set accordingly
    expect(titleService.getTitle()).toBe('Test Song');
  });

  it('should properly load metadata for different stations', () => {
    // Arrange
    // Set up dummy data
    const testEntries = [
      { title: 'test title', station: 'test station', throw: false },
      { title: null, station: 'test station', throw: false },
      { title: 'error', station: 'error', throw: true }
    ];
    // The audio element should not have been played or paused yet
    expect(audioElementPauseSpy).not.toHaveBeenCalled();
    expect(audioElementPlaySpy).not.toHaveBeenCalled();

    let iteration = 1;
    testEntries.forEach(testEntry => {
      // Act
      // Play our test station
      const testStation = new Station(testEntry.station, null);
      playerService.playStation(testStation);

      // Assert
      /* Between the init of loadMetadata and the return of metadata,
      the emitted NowPlaying should be in a Loading state */
      expect(nowPlayingSpy.calls.mostRecent().args[0].streamInfo).toBeNull();
      expect(nowPlayingSpy.calls.mostRecent().args[0].streamInfoStatus).toBe(StreamInfoStatus.Loading);
      // pause and play should have been called on the audio element once for each iteration by this point
      expect(audioElementPauseSpy).toHaveBeenCalledTimes(iteration);
      expect(audioElementPlaySpy).toHaveBeenCalledTimes(iteration);

      // Either throw an error or emit the specified metadata
      if (testEntry.throw) {
        // Emit an error from the subject
        streamInfoService.flushError('dummy error');
        // The emitted 'Now Playing' object should denote an error state
        expect(nowPlayingSpy.calls.mostRecent().args[0].streamInfo).toBeNull();
        expect(nowPlayingSpy.calls.mostRecent().args[0].streamInfoStatus).toBe(StreamInfoStatus.Error);
        expect(titleService.getTitle()).toBe('Browninglogic Radio');
      } else {
        // Emit the specified dummy metadata
        streamInfoService.flushMetadata(new StreamInfo(testEntry.title, 'dummy fetchsource', null, testEntry.station));
        // Upon emit of metadata, nowPlaying should have emitted a matching title & station
        expect(nowPlayingSpy.calls.mostRecent().args[0].streamInfo.title).toBe(testEntry.title);
        expect(nowPlayingSpy.calls.mostRecent().args[0].station.title).toBe(testEntry.station);
        /* The document title should either be the song title or the station title,
        depending on whether a non-blank song title is available. */
        if (!isBlank(testEntry.title)) {
          expect(titleService.getTitle()).toBe(testEntry.title);
        } else {
          expect(titleService.getTitle()).toBe(testEntry.station);
        }
      }

      iteration++;
    });

    // The audio should have been played once for each test entry
    expect(audioElementPlaySpy).toHaveBeenCalledTimes(testEntries.length);
    // We should have fetched metadata once for each test entry
    expect(streamInfoService.getMetadataSpy).toHaveBeenCalledTimes(testEntries.length);
  });

  it('should properly refresh metadata on an interval', fakeAsync(() => {
    // Arrange
    // Configure some test Metadata entries
    const testEntries = [
      new StreamInfo('Title 1', 'Fetchsource 1'),
      new StreamInfo('another title', 'another fetchsource'),
      new StreamInfo('Blind Guardian - Valkyries', 'STREAM'),
      new StreamInfo('Iced Earth - Night of the Stormrider', 'STREAM')
    ];

    // Play a test station and immediately flush a metadata entry for the initial fetch
    playerService.playStation(new Station('Test Station', 'Test url'));
    streamInfoService.flushMetadata(testEntries[0]);
    let previousTitle = testEntries[0].title;

    // For each test entry
    let iteration = 1;
    testEntries.forEach(testEntry => {
      /* Wait for the refresh interval, at which point we expect the service to ask
      for updated metadata. */
      tick(configServiceSpy.appConfig.metadataRefreshInterval);
      /* While waiting for a response, the now playing info should still be that of
      the previous iteration (rather than 'Loading Metadata'). */
      expect(nowPlayingSpy.calls.mostRecent().args[0].streamInfo.title).toBe(previousTitle);
      // Flush a test metadata entry
      streamInfoService.flushMetadata(testEntry);
      // Ensure that the test title was updated as expected
      expect(nowPlayingSpy.calls.mostRecent().args[0].streamInfo.title).toBe(testEntry.title);
      // Update previousTitle to check on the next iteration
      previousTitle = testEntry.title;
      iteration++;
    });

    /* Wait for the delay(0) caused by changing nowPlaying in order to prevent the
    '1 periodic timer(s) still in the queue' error. */
    tick(0);
    // Pause the audio in order to unsubscribe from the interval subscription
    playerService.pause();
    // We should have fetched metadata once for each test entry, plus once for the initial fetch
    expect(streamInfoService.getMetadataSpy).toHaveBeenCalledTimes(testEntries.length + 1);
  }));

  it('should not initiate a new metadata fetch if the previous one is still in progress', fakeAsync(() => {
    /* Act: Initiate the station play and wait for 3 times the refresh interval
    before flushing any metadata. */
    playerService.playStation(new Station('Station Title', 'station url'));
    tick(configServiceSpy.appConfig.metadataRefreshInterval * 3);
    streamInfoService.flushMetadata(new StreamInfo('Title 1', 'Fetchsource 1'));
    expect(nowPlayingSpy.calls.mostRecent().args[0].streamInfo.title).toBe('Title 1');
    // Assert: Ensure that getMetadata was only actually called once
    expect(streamInfoService.getMetadataSpy).toHaveBeenCalledTimes(1);
    /* Wait for the delay(0) caused by changing nowPlaying in order to prevent the
    '1 periodic timer(s) still in the queue' error. */
    tick(0);
    // Pause in order to unsubscribe from the interval subscription
    playerService.pause();
  }));

  it('should emit a new NowPlaying object for each NowPlaying change (rather than mutating an existing object)', fakeAsync(() => {
    // Arrange
    // Configure some test Metadata entries
    const testEntries = [
      new StreamInfo('Title 1', 'Fetchsource 1'),
      new StreamInfo('another title', 'another fetchsource'),
      new StreamInfo('Blind Guardian - Valkyries', 'STREAM'),
      new StreamInfo('Iced Earth - Night of the Stormrider', 'STREAM')
    ];

    // For each test entry
    let iteration = 1;
    let previousNowPlaying: NowPlaying;
    testEntries.forEach(testEntry => {
      // Play a station and flush the test metadata entry
      playerService.playStation(new Station('Test Station', 'Test url'));
      streamInfoService.flushMetadata(testEntry);

      // For all iterations after the first
      if (iteration > 1) {
        /* Check to ensure that the most recent NowPlaying isn't the same object
        reference as the NowPlaying from the previous iteration. */
        expect(nowPlayingSpy.calls.mostRecent().args[0]).not.toBe(previousNowPlaying);
      }

      previousNowPlaying = nowPlayingSpy.calls.mostRecent().args[0];
      iteration++;
    });
    /* Wait for the delay(0) caused by changing nowPlaying in order to prevent the
    '1 periodic timer(s) still in the queue' error. */
    tick(0);
    // Pause in order to unsubscribe from the interval subscription
    playerService.pause();
    // We should have fetched metadata once for each test entry
    expect(streamInfoService.getMetadataSpy).toHaveBeenCalledTimes(testEntries.length);
  }));

  it('should only emit a new NowPlaying object when the new NowPlaying is different from the previous.', fakeAsync(() => {
    // Arrange
    // Configure some test Metadata entries
    const testEntries = [
      new StreamInfo('Title 1', 'Fetchsource 1'),
      new StreamInfo('Title 1', 'Fetchsource 1'),
      new StreamInfo('Title 1', 'Fetchsource 1'),
      new StreamInfo('Title 1', 'Fetchsource 1'),
      new StreamInfo('Title 1', 'Fetchsource 1'),
      new StreamInfo('Title 1', 'Fetchsource 1'),
      new StreamInfo('Title 1', 'Fetchsource 1'),
      new StreamInfo('Title 1', 'Fetchsource 1'),
      new StreamInfo('Title 1', 'Fetchsource 1'),
      new StreamInfo('Title 1', 'Fetchsource 1'),
      new StreamInfo('Title 1', 'Fetchsource 1'),
      new StreamInfo('Title 1', 'Fetchsource 1'),
      new StreamInfo('Title 1', 'Fetchsource 1'),
      new StreamInfo('Title 1', 'Fetchsource 1'),
      new StreamInfo('Title 1', 'Fetchsource 1')
    ];

    // Play a test station and immediately flush a metadata entry for the initial fetch
    playerService.playStation(new Station('Test Station', 'Test url'));
    streamInfoService.flushMetadata(testEntries[0]);

    // For each test entry
    let iteration = 1;
    testEntries.forEach(testEntry => {
      /* Wait for the refresh interval, at which point we expect the service to ask
      for updated metadata. */
      tick(configServiceSpy.appConfig.metadataRefreshInterval);
      /* Flush a new test metadata entry, each of which should be different
      objects which equal each other. */
      streamInfoService.flushMetadata(testEntry);
      iteration++;
    });

    /* Wait for the delay(0) caused by changing nowPlaying in order to prevent the
    '1 periodic timer(s) still in the queue' error. */
    tick(0);
    // Pause the audio in order to unsubscribe from the interval subscription
    playerService.pause();
    // We should have fetched metadata once for each test entry, plus once for the initial fetch
    expect(streamInfoService.getMetadataSpy).toHaveBeenCalledTimes(testEntries.length + 1);
    /* Because the same stream info was emitted over and over, NowPlaying should have only
    emitted four times:
    1) Once for the initial subscription to BehaviorSubject
    2) Once within the call to UpdateStation
    3) Once when setting the status to Loading
    4) Once when resolving the initial stream info
    Importantly, the same stream info was emitted over and over again, but NowPlaying
    didn't emit any more because the subsequent values were all equal. */
    expect(nowPlayingSpy).toHaveBeenCalledTimes(4);
  }));
});
