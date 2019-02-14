import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorWindowComponent } from './error-window.component';

describe('ErrorWindowComponent', () => {
  let component: ErrorWindowComponent;
  let fixture: ComponentFixture<ErrorWindowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ErrorWindowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
