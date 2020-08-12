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
import { PlayerStatus, initialPlayerState, Station } from '@core/models/player';
import { PlayerSelectors, StreamMetadataFacadeService } from '@core/store';
import { CoreSpyFactories, StreamMetadataFacadeStub } from '@core/testing';
import { isFalsyOrWhitespace } from '@utilities';
import { SleepTimerService } from '@core/services';
import { BehaviorSubject, Observable, defer, of } from 'rxjs';


describe('NowPlayingComponent', () => {
  let component: NowPlayingComponent;
  let fixture: ComponentFixture<NowPlayingComponent>;
  let keepAwakeServiceSpy: any;
  let sleepTimerService: jasmine.SpyObj<SleepTimerService>;
  let store: MockStore<RootState>;
  let minutesUntilSleep$: Observable<number>;
  let metadataForCurrentStation$: Observable<string>;
  let metadataFacade: StreamMetadataFacadeStub;

  beforeEach(async(() => {
    keepAwakeServiceSpy = CoreSpyFactories.createKeepAwakeServiceSpy();

    sleepTimerService = CoreSpyFactories.createSleepTimerServiceSpy();
    sleepTimerService.minutesToSleep$ = defer(() => minutesUntilSleep$);

    metadataFacade = new StreamMetadataFacadeStub();
    metadataFacade.metadataForCurrentStation$ = defer(() => metadataForCurrentStation$);

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
        provideMockStore({ initialState: initialRootState }),
        { provide: KeepAwakeService, useValue: keepAwakeServiceSpy },
        { provide: SleepTimerService, useValue: sleepTimerService },
        { provide: StreamMetadataFacadeService, useValue: metadataFacade }
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
      metadata: 'station title from stream'
    },
    {
      station: new Station(null, 'station title 2', 'http://url2.com', 'station genre 2', 'http://icon2.com/'),
      metadata: 'station title from stream 2',
    },
    {
      station: new Station(null, 'another station title', 'http://anotherurl.com', 'another station genre', 'http://anothericon.com/'),
      metadata: 'station 3',
    },
    {
      station: new Station(null, 'Radio Caprice: Speed Metal', 'http://radiocapricespeedmetal.com', 'Speed Metal', 'http://icon4.com/'),
      metadata: 'stream station title',
    }
  ];
  nowPlayingTemplateInput.forEach(input => {
    it('should update the template to reflect changes in metadata', () => {
      // Act
      store.setState({
        ...initialRootState,
        player: {
          ...initialPlayerState,
          currentStation: input.station,
          playerStatus: PlayerStatus.Playing
        }
      });
      store.refreshState();
      metadataForCurrentStation$ = of(input.metadata);
      fixture.detectChanges();

      // Assert: Ensure that the important NowPlaying properties were properly bound to the template
      expect(getElementBySelector<NowPlayingComponent>(fixture, '.station-icon').src).toBe(input.station.iconUrl);
      expect(getElementTextBySelector<NowPlayingComponent>(fixture, '.station-title')).toBe(input.station.title);
      expect(getElementTextBySelector<NowPlayingComponent>(fixture, '.title')).toBe(input.metadata);
    });
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
      playerStatus: PlayerStatus.Playing,
      metadata: 'Valid Title',
      expected: 'Valid Title'
    },
  ];
  playerStatusTemplateInput.forEach(input => {
    it(`should reflect the various player states properly in the template ${JSON.stringify(input)}`, () => {
      // Arrange & Act
      store.overrideSelector(PlayerSelectors.selectCurrentStation, new Station());
      store.overrideSelector(PlayerSelectors.selectPlayerStatus, input.playerStatus);
      store.overrideSelector(PlayerSelectors.selectIsValidationInProgressForCurrentStation, input.validating);
      metadataForCurrentStation$ = of(input.metadata);
      store.refreshState();
      fixture.detectChanges();

      // Assert: Ensure that the text of the title element conveys the current stream status
      expect(getElementTextBySelector<NowPlayingComponent>(fixture, '.title')).toBe(input.expected);
    });
  });

  it('should update the template to reflect changes in minutes until sleep', () => {
    // Arrange
    const minutesUntilSleep = new BehaviorSubject<number>(null);
    minutesUntilSleep$ = minutesUntilSleep.asObservable();
    // Emit an empty nowPlaying so that the 'selected' template is rendered
    const state = {
      ...initialRootState,
      player: {
        ...initialPlayerState,
        currentStation: new Station(),
      }
    };
    store.setState(state);

    for (let i = 300; i >= 0; i--) {
      // Act
      minutesUntilSleep.next(i);
      fixture.detectChanges();
      // Assert: Ensure that the new value was rendered properly in the template
      expect(getElementTextBySelector<NowPlayingComponent>(fixture, '.minutes-until-sleep')).toBe(`Sleeping in ${i} minutes`);
    }

    /* Clear the sleep timer and ensure that 'minutes until sleep' is
    removed from the template accordingly. */
    minutesUntilSleep.next(null);
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
