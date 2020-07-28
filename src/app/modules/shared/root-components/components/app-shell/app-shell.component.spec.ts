import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AppShellComponent } from './app-shell.component';
import { provideMockStore } from '@ngrx/store/testing';
import { initialRootState } from '@core';
import { RouterTestingModule } from '@angular/router/testing';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ResponsiveSidenavStubComponent, SidenavStubComponent } from '@root-components/testing';

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
        provideMockStore({initialState: initialRootState}),
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
