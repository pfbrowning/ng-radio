import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AppShellComponent } from './app-shell.component';
import { RouterTestingModule } from '@angular/router/testing';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ResponsiveSidenavStubComponent, SidenavStubComponent } from '@root-components/testing';
import { PlayerFacadeService, FavoriteStationsFacadeService, StreamMetadataFacadeService } from '@core/store';
import { SleepTimerService } from '@core/services';
import { CoreSpyFactories, PlayerFacadeStub, FavoriteStationsFacadeStub, StreamMetadataFacadeStub } from '@core/testing';

describe('AppShellComponent', () => {
  let component: AppShellComponent;
  let fixture: ComponentFixture<AppShellComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppShellComponent,
        ResponsiveSidenavStubComponent,
        SidenavStubComponent
      ],
      imports: [
        RouterTestingModule,
        MatIconModule,
        MatToolbarModule
      ],
      providers: [
        { provide: PlayerFacadeService, useClass: PlayerFacadeStub },
        { provide: SleepTimerService, useValue: CoreSpyFactories.createSleepTimerServiceSpy() },
        { provide: FavoriteStationsFacadeService, useClass: FavoriteStationsFacadeStub },
        { provide: StreamMetadataFacadeService, useClass: StreamMetadataFacadeStub }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppShellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
