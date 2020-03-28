import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RadioBrowserComponent } from './radio-browser.component';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { FormsModule } from '@angular/forms';
import { PlayerService, StationLookupService } from '@core';
import {
  createPlayerServiceSpy,
  createStationLookupServiceSpy
} from '@core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

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
        { provide: PlayerService, useValue: createPlayerServiceSpy() },
        { provide: StationLookupService, useValue: createStationLookupServiceSpy() }
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
