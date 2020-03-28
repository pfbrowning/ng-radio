import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CustomStationComponent } from './custom-station.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { PlayerService } from '@core';
import { createPlayerServiceSpy } from '@core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('CustomStationComponent', () => {
  let component: CustomStationComponent;
  let fixture: ComponentFixture<CustomStationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        RouterTestingModule,
        NoopAnimationsModule,
        MatFormFieldModule,
        MatInputModule
      ],
      declarations: [ CustomStationComponent ],
      providers: [
        { provide: PlayerService, useValue: createPlayerServiceSpy() },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomStationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
