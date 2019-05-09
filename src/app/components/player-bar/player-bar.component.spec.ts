import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { PlayerBarComponent } from './player-bar.component';
import { MatTooltipModule, MatIconModule, MatButtonModule, MatToolbarModule,
  MatMenuModule, MatFormFieldModule, MatInputModule } from '@angular/material';
import { NotificationsSpyFactories } from '@modules/core/notifications/testing/notifications-spy-factories.spec';
import { PlayerService, CoreRadioLogicModule } from '@modules/core/core-radio-logic/core-radio-logic.module';
import { CoreRadioLogicSpyFactories } from '@modules/core/core-radio-logic/testing/core-radio-logic-spy-factories.spec';
import { SleepTimerMenuComponent } from '../sleep-timer-menu/sleep-timer-menu.component';
import { NotificationService, Severities } from '@modules/core/notifications/notifications.module';
import { KeepAwakeService } from '@modules/core/keep-awake/keep-awake.module';
import { PlayerBarStationInfoComponent } from '../player-bar-station-info/player-bar-station-info.component';
import { CustomStationWindowComponent } from '../custom-station-window/custom-station-window.component';
import { ModalManagerModule } from '@browninglogic/ng-modal';
import { FormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { KeepAwakeSpyFactories } from '@modules/core/keep-awake/testing/keep-awake-spy-factories.spec';

describe('PlayerBarComponent', () => {
  let component: PlayerBarComponent;
  let fixture: ComponentFixture<PlayerBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        PlayerBarComponent,
        SleepTimerMenuComponent,
        PlayerBarStationInfoComponent,
        CustomStationWindowComponent
      ],
      imports: [
        RouterTestingModule,
        MatMenuModule,
        MatToolbarModule,
        MatButtonModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        MatTooltipModule,
        ModalManagerModule,
        FormsModule,
        NoopAnimationsModule,
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
    fixture = TestBed.createComponent(PlayerBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
