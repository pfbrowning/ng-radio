import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SleepTimerMenuComponent } from './sleep-timer-menu.component';
import { MatMenuModule } from '@angular/material/menu';
import { provideMockStore } from '@ngrx/store/testing';
import { initialRootState } from '@core';

describe('SleepTimerMenuComponent', () => {
  let component: SleepTimerMenuComponent;
  let fixture: ComponentFixture<SleepTimerMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SleepTimerMenuComponent ],
      imports: [
        MatMenuModule
      ],
      providers: [
        provideMockStore({initialState: initialRootState})
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
