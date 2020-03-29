import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RadioBrowserComponent } from './radio-browser.component';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { FormsModule } from '@angular/forms';
import { StationLookupService } from '@core';
import { createStationLookupServiceSpy } from '@core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideMockStore } from '@ngrx/store/testing';
import { initialRootState } from '@root-state';

describe('RadioBrowserComponent', () => {
  let component: RadioBrowserComponent;
  let fixture: ComponentFixture<RadioBrowserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RadioBrowserComponent ],
      imports: [
        MatFormFieldModule,
        MatTableModule,
        MatFormFieldModule,
        MatInputModule,
        MatProgressSpinnerModule,
        MatCardModule,
        FormsModule,
        NoopAnimationsModule
      ],
      providers: [
        { provide: StationLookupService, useValue: createStationLookupServiceSpy() },
        provideMockStore({initialState: initialRootState})
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RadioBrowserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});