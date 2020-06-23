import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SidenavComponent } from './sidenav.component';
import { OAuthService } from 'angular-oauth2-oidc';
import { provideMockStore } from '@ngrx/store/testing';
import { initialRootState } from '@core';
import { CoreSpyFactories } from '@core/testing';

describe('SidenavComponent', () => {
  let component: SidenavComponent;
  let fixture: ComponentFixture<SidenavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SidenavComponent ],
      providers: [
        { provide: OAuthService, useValue: CoreSpyFactories.createOAuthServiceSpy() },
        provideMockStore({initialState: initialRootState})
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SidenavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
