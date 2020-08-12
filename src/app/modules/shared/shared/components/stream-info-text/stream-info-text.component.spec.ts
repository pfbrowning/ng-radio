import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { StreamInfoTextComponent } from './stream-info-text.component';
import theoretically from 'jasmine-theories';

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
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});
