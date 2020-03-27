import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RadioAppComponent } from './radio-app.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SidenavComponent, PlayerBarComponent, PlayerBarStationInfoComponent } from '../../radio-app.module';
import { RouterTestingModule } from '@angular/router/testing';
import { ResponsiveSidenavModule } from '@modules/core/responsive-sidenav/responsive-sidenav.module';
import { SharedComponentsModule } from '@modules/shared/shared-components/shared-components.module';
import { AuthenticationService } from '@modules/core/authentication/authentication.module';
import { createAuthenticationServiceSpy } from '@modules/core/authentication/testing/authentication-spy-factories.spec';
import {
  createPlayerServiceSpy,
  createStationLookupServiceSpy
} from '@modules/core/core-radio-logic/testing/core-radio-logic-spy-factories.spec';
import { StationLookupService, PlayerService, CoreRadioLogicModule } from '@modules/core/core-radio-logic/core-radio-logic.module';
import { NotificationsSpyFactories } from '@modules/core/notifications/testing/notifications-spy-factories.spec';
import { NotificationService } from '@modules/core/notifications/notifications.module';
import { KeepAwakeService } from '@modules/core/keep-awake/keep-awake.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { createKeepAwakeServiceSpy } from '@modules/core/keep-awake/testing/keep-awake-spy-factories.spec';
import { provideMockStore } from '@ngrx/store/testing';
import { initialRootState } from '@root-state';

describe('RadioAppComponent', () => {
  let component: RadioAppComponent;
  let fixture: ComponentFixture<RadioAppComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        RadioAppComponent,
        SidenavComponent,
        PlayerBarComponent,
        PlayerBarStationInfoComponent
      ],
      imports: [
        MatIconModule,
        MatToolbarModule,
        MatButtonModule,
        MatMenuModule,
        MatTooltipModule,
        RouterTestingModule,
        ResponsiveSidenavModule,
        SharedComponentsModule,
        CoreRadioLogicModule,
        NoopAnimationsModule
      ],
      providers: [
        { provide: AuthenticationService, useValue: createAuthenticationServiceSpy() },
        { provide: PlayerService, useValue: createPlayerServiceSpy() },
        { provide: StationLookupService, useValue: createStationLookupServiceSpy() },
        { provide: NotificationService, useValue: NotificationsSpyFactories.CreateNotificationServiceSpy() },
        { provide: KeepAwakeService, useValue: createKeepAwakeServiceSpy() },
        provideMockStore({ initialState: initialRootState })
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RadioAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
