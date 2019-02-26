import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SleepTimerMenuComponent } from './sleep-timer-menu.component';
import { MatMenuModule } from '@angular/material/menu';

describe('SleepTimerMenuComponent', () => {
  let component: SleepTimerMenuComponent;
  let fixture: ComponentFixture<SleepTimerMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SleepTimerMenuComponent ],
      imports: [
        MatMenuModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SleepTimerMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
