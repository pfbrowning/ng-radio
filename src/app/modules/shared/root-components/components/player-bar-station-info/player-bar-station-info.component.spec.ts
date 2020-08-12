import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PlayerBarStationInfoComponent } from './player-bar-station-info.component';
import { getElementTextBySelector } from '@utilities/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { RootState, initialRootState } from '@core';
import { Station, PlayerStatus } from '@core/models/player';
import { PlayerSelectors, StreamMetadataFacadeService } from '@core/store';
import { SharedModule } from '@shared';
import { StreamMetadataFacadeStub } from '@core/testing';
import { of, Observable, defer } from 'rxjs';
import { metadataForCurrentStation } from 'src/app/modules/core/store/stream-metadata/selectors/player-metadata.selectors';

describe('PlayerBarStationInfoComponent', () => {
  let component: PlayerBarStationInfoComponent;
  let fixture: ComponentFixture<PlayerBarStationInfoComponent>;
  let streamMetadataFacade: StreamMetadataFacadeStub;
  let metadataForCurrentStation$: Observable<string>;

  beforeEach(async(() => {
    streamMetadataFacade = new StreamMetadataFacadeStub();
    streamMetadataFacade.metadataForCurrentStation$ = defer(() => metadataForCurrentStation$);

    TestBed.configureTestingModule({
      declarations: [ PlayerBarStationInfoComponent ],
      imports: [
        SharedModule
      ],
      providers: [
        provideMockStore({initialState: initialRootState}),
        { provide: StreamMetadataFacadeService, useValue: streamMetadataFacade }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerBarStationInfoComponent);
    streamMetadataFacade = TestBed.inject(StreamMetadataFacadeService) as any;
    component = fixture.componentInstance;
    component.currentStation = new Station();
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
      streamInfo: 'Valid Title',
      playerStatus: PlayerStatus.Playing,
      expected: 'Valid Title'
    },
  ];
  playerStatusTemplateInput.forEach(input => {
    it('should reflect the various player states properly in the template', () => {
      // Arrange & Act
      component.currentPlayerStatus = input.playerStatus;
      component.validatingCurrent = input.validating;
      metadataForCurrentStation$ = of(input.streamInfo);
      fixture.detectChanges();

      // Assert: Ensure that the text of the title element conveys the current stream status
      expect(getElementTextBySelector<PlayerBarStationInfoComponent>(fixture, '.title')).toBe(input.expected);
    });
  })
});
