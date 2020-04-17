import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StreamInfoTextComponent } from './stream-info-text.component';

describe('StreamInfoTextComponent', () => {
  let component: StreamInfoTextComponent;
  let fixture: ComponentFixture<StreamInfoTextComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StreamInfoTextComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StreamInfoTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
