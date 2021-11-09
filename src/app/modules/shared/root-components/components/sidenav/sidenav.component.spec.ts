import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { SidenavComponent } from './sidenav.component';
import { provideMockStore } from '@ngrx/store/testing';
import { initialRootState } from '@core';
import { CoreSpyFactories } from '@core/testing';
import { AuthenticationService } from '@core/services';
import { AuthenticationFacadeService } from '@core/store';

describe('SidenavComponent', () => {
  let component: SidenavComponent;
  let fixture: ComponentFixture<SidenavComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [SidenavComponent],
        providers: [
          {
            provide: AuthenticationService,
            useValue: CoreSpyFactories.createAuthenticationServiceSpy(),
          },
          {
            provide: AuthenticationFacadeService,
            useValue: CoreSpyFactories.createAuthenticationFacadeSpy(),
          },
          provideMockStore({ initialState: initialRootState }),
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(SidenavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
