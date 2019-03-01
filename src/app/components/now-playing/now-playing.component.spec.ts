import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NowPlayingComponent } from './now-playing.component';
import { RouterTestingModule } from '@angular/router/testing';
import { PlayerService } from 'src/app/services/player.service';
import { SpyFactories } from 'src/app/testing/spy-factories.spec';
import { MatMenuModule } from '@angular/material/menu';
import { SleepTimerMenuComponent } from '../sleep-timer-menu/sleep-timer-menu.component';
import { NotificationService } from 'src/app/services/notification.service';
import { NoSleepService } from 'src/app/services/no-sleep.service';

describe('NowPlayingComponent', () => {
  let component: NowPlayingComponent;
  let fixture: ComponentFixture<NowPlayingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        NowPlayingComponent,
        SleepTimerMenuComponent
      ],
      imports: [
        RouterTestingModule,
        MatMenuModule
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
    fixture = TestBed.createComponent(NowPlayingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
