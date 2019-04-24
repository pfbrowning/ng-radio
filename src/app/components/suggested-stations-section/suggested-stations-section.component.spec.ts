import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SuggestedStationsSectionComponent } from './suggested-stations-section.component';
import { StationThumbnailComponent } from '../station-thumbnail/station-thumbnail.component';

describe('SuggestedStationsSectionComponent', () => {
  let component: SuggestedStationsSectionComponent;
  let fixture: ComponentFixture<SuggestedStationsSectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        SuggestedStationsSectionComponent,
        StationThumbnailComponent
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuggestedStationsSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
