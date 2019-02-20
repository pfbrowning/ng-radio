import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ResponsiveSidenavComponent } from './responsive-sidenav.component';
import { MatSidenavModule } from '@angular/material/sidenav'; 
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('ResponsiveSidenavComponent', () => {
  let component: ResponsiveSidenavComponent;
  let fixture: ComponentFixture<ResponsiveSidenavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResponsiveSidenavComponent ],
      imports: [
        MatSidenavModule,
        RouterTestingModule,
        NoopAnimationsModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResponsiveSidenavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
