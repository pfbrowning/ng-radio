import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StationThumbnailComponent } from './station-thumbnail.component';

describe('StationThumbnailComponent', () => {
  let component: StationThumbnailComponent;
  let fixture: ComponentFixture<StationThumbnailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StationThumbnailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StationThumbnailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
