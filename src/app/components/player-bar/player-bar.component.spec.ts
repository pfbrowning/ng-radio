import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { PlayerBarComponent } from './player-bar.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { SpyFactories } from 'src/app/testing/spy-factories.spec';
import { PlayerService } from 'src/app/services/player.service';
import { SleepTimerMenuComponent } from '../sleep-timer-menu/sleep-timer-menu.component';
import { NotificationService } from 'src/app/services/notification.service';
import { KeepAwakeService } from 'src/app/services/keep-awake.service';
import { PlayerBarStationInfoComponent } from '../player-bar-station-info/player-bar-station-info.component';
import { CustomStationWindowComponent } from '../custom-station-window/custom-station-window.component';
import { ModalManagerModule } from '@browninglogic/ng-modal';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

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
        ModalManagerModule,
        FormsModule,
        NoopAnimationsModule
      ],
      providers: [
        { provide: PlayerService, useValue: SpyFactories.CreatePlayerServiceSpy() },
        { provide: NotificationService, useValue: SpyFactories.CreateNotificationServiceSpy() },
        { provide: KeepAwakeService, useValue: SpyFactories.CreateKeepAwakeServiceSpy() }
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
