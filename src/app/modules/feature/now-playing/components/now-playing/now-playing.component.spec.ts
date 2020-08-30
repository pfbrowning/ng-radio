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
import { provideMockStore } from '@ngrx/store/testing';
import { initialRootState } from '@core';
import { PlayerStatus, Station } from '@core/models/player';
import { StreamMetadataFacadeService, PlayerFacadeService } from '@core/store';
import { CoreSpyFactories, StreamMetadataFacadeStub } from '@core/testing';
import { SleepTimerService } from '@core/services';
import { BehaviorSubject, Observable, defer, of } from 'rxjs';
import { PlayerFacadeStub } from 'src/app/modules/core/testing/stubs/player-facade-stub.service.spec';
import { StationIconStubDirective } from '@shared/testing';


describe('NowPlayingComponent', () => {
  let component: NowPlayingComponent;
  let fixture: ComponentFixture<NowPlayingComponent>;
  let keepAwakeServiceSpy: any;
  let sleepTimerService: jasmine.SpyObj<SleepTimerService>;
  let currentStation$: Observable<Station>;
  let playerStatus$: Observable<PlayerStatus>;
  let minutesUntilSleep$: Observable<number>;
  let metadataFacade: StreamMetadataFacadeStub;
  let playerFacade: PlayerFacadeStub;

  beforeEach(async(() => {
    keepAwakeServiceSpy = CoreSpyFactories.createKeepAwakeServiceSpy();

    sleepTimerService = CoreSpyFactories.createSleepTimerServiceSpy();
    sleepTimerService.minutesToSleep$ = defer(() => minutesUntilSleep$);

    metadataFacade = new StreamMetadataFacadeStub();

    playerFacade = new PlayerFacadeStub();
    playerFacade.currentStation$ = defer(() => currentStation$);
    playerFacade.playerStatus$ = defer(() => playerStatus$);

    TestBed.configureTestingModule({
      declarations: [
        NowPlayingComponent,
        StationIconStubDirective
      ],
      imports: [
        RouterTestingModule,
        MatMenuModule,
        MatFormFieldModule,
        MatInputModule,
        NoopAnimationsModule,
        FormsModule,
      ],
      providers: [
        provideMockStore({ initialState: initialRootState }),
        { provide: KeepAwakeService, useValue: keepAwakeServiceSpy },
        { provide: SleepTimerService, useValue: sleepTimerService },
        { provide: StreamMetadataFacadeService, useValue: metadataFacade },
        { provide: PlayerFacadeService, useValue: playerFacade }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NowPlayingComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  const nowPlayingTemplateInput: Station[] = [
    { title: 'station title' } as Station,
    { title: 'station title 2' } as Station,
    { title: 'another station title' } as Station,
    { title: 'Radio Caprice: Speed Metal' } as Station
  ];
  nowPlayingTemplateInput.forEach(station => {
    it('should update the template to reflect changes in station title', () => {
      // Act
      currentStation$ = of(station);
      playerStatus$ = of(PlayerStatus.Playing);
      fixture.detectChanges();

      // Assert: Ensure that the station title was properly bound to the template
      expect(getElementTextBySelector<NowPlayingComponent>(fixture, '.station-title')).toBe(station.title);
    });
  });

  it('should update the template to reflect changes in minutes until sleep', () => {
    // Arrange
    const minutesUntilSleep = new BehaviorSubject<number>(null);
    minutesUntilSleep$ = minutesUntilSleep.asObservable();
    currentStation$ = of(new Station());

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
    currentStation$ = of(new Station());
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
