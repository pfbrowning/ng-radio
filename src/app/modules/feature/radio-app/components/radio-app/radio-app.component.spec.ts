import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RadioAppComponent } from './radio-app.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SidenavComponent, PlayerBarComponent, PlayerBarStationInfoComponent } from '../../radio-app.module';
import { RouterTestingModule } from '@angular/router/testing';
import { ResponsiveSidenavModule } from '@responsive-sidenav';
import { SharedComponentsModule } from '@shared-components';
import { AuthenticationService } from '@authentication';
import { createAuthenticationServiceSpy } from '@authentication/testing';
import {
  createPlayerServiceSpy,
  createStationLookupServiceSpy
} from '@core/testing';
import { StationLookupService, PlayerService, CoreModule } from '@core';
import { NotificationService } from '@notifications';
import { KeepAwakeService } from '@keep-awake';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { createKeepAwakeServiceSpy } from '@keep-awake/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { initialRootState } from '@root-state';
import { createNotificationServiceSpy } from '@notifications/testing';

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
        CoreModule,
        NoopAnimationsModule
      ],
      providers: [
        { provide: AuthenticationService, useValue: createAuthenticationServiceSpy() },
        { provide: PlayerService, useValue: createPlayerServiceSpy() },
        { provide: StationLookupService, useValue: createStationLookupServiceSpy() },
        { provide: NotificationService, useValue: createNotificationServiceSpy() },
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
