import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { PlayerService } from './player.service';
import { ConfigService } from './config.service';
import { SpyFactories } from '../testing/spy-factories.spec';
import { MetadataService } from './metadata.service';
import { NotificationService, Severities } from './notification.service';
import { AudioElementToken } from '../injection-tokens/audio-element-token';
import { AudioElementStub } from '../testing/stubs/AudioElementStub';
import { Station } from '../models/station';
import { NowPlaying } from '../models/now-playing';
import { Subject, timer } from 'rxjs';
import { Metadata } from '../models/metadata';
import { Title } from '@angular/platform-browser';
import isBlank from 'is-blank';

describe('PlayerService', () => {
  let playerService: PlayerService;
  let titleService: Title;
  let audioPausedSpy: jasmine.Spy;
  let notificationServiceSpy: jasmine.SpyObj<NotificationService>;
  let metadataServiceSpy: jasmine.SpyObj<MetadataService>;
  let configServiceSpy: jasmine.SpyObj<ConfigService>;
  let audioElement: AudioElementStub;
  let audioElementPlaySpy: jasmine.Spy;
  let audioElementPauseSpy: jasmine.Spy;
  let nowPlayingSpy: jasmine.Spy;
  let metadataSubject: Subject<Metadata>;

  beforeEach(() => {
    metadataSubject = new Subject<Metadata>();
    audioElement = new AudioElementStub();
    notificationServiceSpy = SpyFactories.CreateNotificationServiceSpy();
    metadataServiceSpy = SpyFactories.CreateMetadataServiceSpy();
    configServiceSpy = SpyFactories.CreateConfigServiceSpy();

    TestBed.configureTestingModule({
      providers: [
        { provide: ConfigService, useValue: configServiceSpy },
        { provide: MetadataService, useValue: metadataServiceSpy },
        { provide: NotificationService, useValue: notificationServiceSpy },
        { provide: AudioElementToken, useValue: audioElement }
      ]
    });
    playerService = TestBed.get(PlayerService);
    titleService = TestBed.get(Title);
    audioPausedSpy = jasmine.createSpy('audioPaused');
    nowPlayingSpy = jasmine.createSpy('nowPlaying');
    audioElementPauseSpy = spyOn(audioElement, 'pause').and.callThrough();
    audioElementPlaySpy = spyOn(audioElement, 'play').and.callThrough();
    playerService.audioPaused.subscribe(() => audioPausedSpy());
    playerService.nowPlaying$.subscribe(nowPlaying => nowPlayingSpy(nowPlaying));
    metadataServiceSpy.getMetadata.and.returnValue(metadataSubject);
  });

  it('should be created', () => {
    expect(playerService).toBeTruthy();
  });

  it('should emit audioPaused event on audio paused', () => {
    expect(audioPausedSpy).not.toHaveBeenCalled();
    audioElement.pause();
    expect(audioPausedSpy).toHaveBeenCalledTimes(1);
  });

  it('should notify the user when the audio fails to play', () => {
    // Arrange: Ensure that notify hasn't been called and set the source to a dummy url.
    expect(notificationServiceSpy.notify).not.toHaveBeenCalled();
    audioElement.source = 'someaudio';
    // Act: Emit an audio error
    audioElement.error.emit('some error');
    // Assert: Ensure that notify was called as expected
    expect(notificationServiceSpy.notify).toHaveBeenCalledTimes(1);
    expect(notificationServiceSpy.notify.calls.mostRecent().args)
      .toEqual([Severities.Error, 'Failed to play audio', 'Failed to play someaudio']);
  });

  it('should properly report whether a station is selected', () => {
    // Arrange: Define a few test entries with dummy values
    const testEntries = [
      { 'source': 'someurl', shouldBeSelected: true },
      { 'source': 'http://79.111.119.111:9107/;', shouldBeSelected: true },
      { 'source': '     ', shouldBeSelected: false },
      { 'source': null, shouldBeSelected: false },
      { 'source': undefined, shouldBeSelected: false }
    ];

    // For each test entry
    testEntries.forEach(testEntry => {
      // Arrange: set the audio source
      audioElement.source = testEntry.source;
      // Act & Assert: Ensure that stationSelected is as expected
      expect(playerService.stationSelected).toBe(testEntry.shouldBeSelected);
    });
  });

  it('should properly report paused status', () => {
    // The audioElement is paused on initialization
    expect(playerService.isPaused).toBe(true);
    // Play the audioElement directly
    audioElement.play();
    // isPaused should be false
    expect(playerService.isPaused).toBe(false);
    // Pause the audioElement directly
    audioElement.pause();
    // isPaused should be true
    expect(playerService.isPaused).toBe(true);
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
      // Ensure that the audi was paused and played once for this iteration
      expect(audioElementPauseSpy).toHaveBeenCalledTimes(iteration + 1);
      expect(audioElementPlaySpy).toHaveBeenCalledTimes(iteration + 1);
      // Ensure that the audio url was updated
      expect(audioElement.source).toBe(testEntry.url);

      // Ensure that the appropriate NowPlaying data was emitted by the BehaviorSubject
      const latestNowPlaying: NowPlaying = nowPlayingSpy.calls.mostRecent().args[0];
      expect(latestNowPlaying.station).toBe(testEntry.title);
      expect(latestNowPlaying.genre).toBe(testEntry.genre);
      expect(latestNowPlaying.iconUrl).toBe(testEntry.iconUrl);
      expect(latestNowPlaying.tags).toEqual(testEntry.tags);

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
    the title should be 'Loading Metadata...' */
    expect(nowPlayingSpy.calls.mostRecent().args[0].title).toBe('Loading Metadata...');
    // pause and play should have been called on the audio element once by this point
    expect(audioElementPauseSpy).toHaveBeenCalledTimes(1);
    expect(audioElementPlaySpy).toHaveBeenCalledTimes(1);

    // Emit dummy metadata
    metadataSubject.next(new Metadata('Test Song', 'dummy fetchsource'));
    // Upon emit of metadata with title of 'Test Song, nowPlaying should have emitted a matching title
    expect(nowPlayingSpy.calls.mostRecent().args[0].title).toBe('Test Song');
    // The document title should have also been set accordingly
    expect(titleService.getTitle()).toBe('Test Song');
  });

  it('should properly handle initial metadata load', () => {
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
      // Act: Play our test station
      const testStation = new Station(testEntry.station, null);
      playerService.playStation(testStation);

      // Assert
      /* Between the init of loadMetadata and the return of metadata,
      the title should be 'Loading Metadata...' */
      expect(nowPlayingSpy.calls.mostRecent().args[0].title).toBe('Loading Metadata...');
      // pause and play should have been called on the audio element once for each iteration by this point
      expect(audioElementPauseSpy).toHaveBeenCalledTimes(iteration);
      expect(audioElementPlaySpy).toHaveBeenCalledTimes(iteration);

      // Either throw an error or emit the specified metadata
      if (testEntry.throw) {
        // Emit an error from the subject
        metadataSubject.error('dummy error');
        // The 'Now Playing' title and the document title should both be set to 'Metadata Unavailable'
        expect(nowPlayingSpy.calls.mostRecent().args[0].title).toBe('Metadata Unavailable');
        expect(titleService.getTitle()).toBe('Metadata Unavailable');
      } else {
        // Emit the specified dummy metadata
        metadataSubject.next(new Metadata(testEntry.title, 'dummy fetchsource', null, testEntry.station));
        // Upon emit of metadata, nowPlaying should have emitted a matching title & station
        expect(nowPlayingSpy.calls.mostRecent().args[0].title).toBe(testEntry.title);
        expect(nowPlayingSpy.calls.mostRecent().args[0].station).toBe(testEntry.station);
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
  });

  it('should properly refresh metadata on an interval', fakeAsync(() => {
    // Arrange
    // Configure some test Metadata entries
    const testEntries = [
      new Metadata('Title 1', 'Fetchsource 1'),
      new Metadata('another title', 'another fetchsource'),
      new Metadata('Blind Guardian - Valkyries (Extended)', 'STREAM'),
      new Metadata('Iced Earth - Night of the Stormrider', 'STREAM')
    ];

    // Play a test station and immediately flush a metadata entry for the initial fetch
    playerService.playStation(new Station('Test Station', 'Test url'));
    metadataSubject.next(testEntries[0]);

    // For each test entry
    testEntries.forEach(testEntry => {
      /* Wait for the refresh interval to pass, at which point we expect
      that the interval on refreshSub will kick off a new call to loadMetadata. */
      tick(configServiceSpy.appConfig.metadataRefreshInterval);
      // Flush a test metadata entry
      metadataSubject.next(testEntry);

      // Ensure that the test title was updated as expected
      expect(nowPlayingSpy.calls.mostRecent().args[0].title).toBe(testEntry.title);
    });

    // Pause the audio in order to unsubscribe from the interval subscription
    playerService.pause();
  }));
});
