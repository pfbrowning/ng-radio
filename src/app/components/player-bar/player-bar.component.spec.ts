import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PlayerBarComponent } from './player-bar.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { SpyFactories } from 'src/app/testing/spy-factories.spec';
import { PlayerService } from 'src/app/services/player.service';
import { SleepTimerMenuComponent } from '../sleep-timer-menu/sleep-timer-menu.component';
import { NotificationService } from 'src/app/services/notification.service';
import { NoSleepService } from 'src/app/services/no-sleep.service';
import { PlayerBarStationInfoComponent } from '../player-bar-station-info/player-bar-station-info.component';

describe('PlayerBarComponent', () => {
  let component: PlayerBarComponent;
  let fixture: ComponentFixture<PlayerBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        PlayerBarComponent,
        SleepTimerMenuComponent,
        PlayerBarStationInfoComponent
      ],
      imports: [
        MatMenuModule,
        MatToolbarModule,
        MatButtonModule,
        MatIconModule
      ],
      providers: [
        { provide: PlayerService, useValue: SpyFactories.CreatePlayerServiceSpy() },
        { provide: NotificationService, useValue: SpyFactories.CreateNotificationServiceSpy() },
        { provide: NoSleepService, useValue: SpyFactories.CreateNoSleepServiceSpy() }
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
