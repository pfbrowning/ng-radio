import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { NowPlayingComponent } from './now-playing.component';
import { RouterTestingModule } from '@angular/router/testing';
import { PlayerService, CoreRadioLogicModule } from '@modules/core-radio-logic/core-radio-logic.module';
import { CoreRadioLogicSpyFactories } from '@modules/core-radio-logic/testing/core-radio-logic-spy-factories.spec';
import { NotificationsSpyFactories } from '@modules/core/notifications/testing/notifications-spy-factories.spec';
import { MatMenuModule } from '@angular/material/menu';
import { SleepTimerMenuComponent } from '../sleep-timer-menu/sleep-timer-menu.component';
import { NotificationService } from '@modules/core/notifications/notifications.module';
import { KeepAwakeService } from '@modules/core/keep-awake/keep-awake.module';
import { CustomStationWindowComponent } from '../custom-station-window/custom-station-window.component';
import { ModalManagerModule } from '@browninglogic/ng-modal';
import { MatInputModule } from '@angular/material/input';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { KeepAwakeSpyFactories } from '@modules/core/keep-awake/testing/keep-awake-spy-factories.spec';


describe('NowPlayingComponent', () => {
  let component: NowPlayingComponent;
  let fixture: ComponentFixture<NowPlayingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        NowPlayingComponent,
        SleepTimerMenuComponent,
        CustomStationWindowComponent
      ],
      imports: [
        RouterTestingModule,
        MatMenuModule,
        ModalManagerModule,
        MatFormFieldModule,
        MatInputModule,
        NoopAnimationsModule,
        FormsModule,
        CoreRadioLogicModule
      ],
      providers: [
        { provide: PlayerService, useValue: CoreRadioLogicSpyFactories.CreatePlayerServiceSpy() },
        { provide: NotificationService, useValue: NotificationsSpyFactories.CreateNotificationServiceSpy() },
        { provide: KeepAwakeService, useValue: KeepAwakeSpyFactories.CreateKeepAwakeServiceSpy() }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NowPlayingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
