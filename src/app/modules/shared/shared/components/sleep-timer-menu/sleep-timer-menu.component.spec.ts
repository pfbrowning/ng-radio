import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SleepTimerMenuComponent } from './sleep-timer-menu.component';
import { MatMenuModule } from '@angular/material/menu';
import { SleepTimerService } from '@core/services';
import { CoreSpyFactories } from '@core/testing';

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
        { provide: SleepTimerService, useValue: CoreSpyFactories.createSleepTimerServiceSpy() }
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
