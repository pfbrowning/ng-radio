import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SuggestedStationsComponent } from './suggested-stations.component';
import { SuggestedStationsSectionComponent } from '../suggested-stations-section/suggested-stations-section.component';
import { StationThumbnailComponent } from '../station-thumbnail/station-thumbnail.component';
import { PlayerService } from '@modules/core/core-radio-logic/core-radio-logic.module';
import { createPlayerServiceSpy } from '@modules/core/core-radio-logic/testing/core-radio-logic-spy-factories.spec';
import { ActivatedRoute } from '@angular/router';
import { ActivatedRouteStub } from '@test-helpers';
import { SuggestedStations } from '../../models/suggested-stations';

describe('SuggestedStationsComponent', () => {
  let component: SuggestedStationsComponent;
  let fixture: ComponentFixture<SuggestedStationsComponent>;
  let activatedRoute: ActivatedRouteStub;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        SuggestedStationsComponent,
        SuggestedStationsSectionComponent,
        StationThumbnailComponent
      ],
      providers: [
        { provide: PlayerService, useValue: createPlayerServiceSpy() },
        { provide: ActivatedRoute, useClass: ActivatedRouteStub }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuggestedStationsComponent);
    component = fixture.componentInstance;
    activatedRoute = TestBed.inject(ActivatedRoute);
    activatedRoute.setData({'suggestedStations': new SuggestedStations([], [], [])});
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
