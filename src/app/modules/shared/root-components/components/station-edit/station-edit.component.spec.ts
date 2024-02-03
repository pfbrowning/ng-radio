import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { StationEditComponent } from './station-edit.component';
import { provideMockStore } from '@ngrx/store/testing';
import { initialRootState } from '@core';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { DialogModule } from 'primeng/dialog';
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner';

describe('StationEditComponent', () => {
  let component: StationEditComponent;
  let fixture: ComponentFixture<StationEditComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [StationEditComponent],
        imports: [
          RouterTestingModule,
          FormsModule,
          MatInputModule,
          NoopAnimationsModule,
          MatProgressSpinnerModule,
          DialogModule,
        ],
        providers: [provideMockStore({ initialState: initialRootState })],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(StationEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
