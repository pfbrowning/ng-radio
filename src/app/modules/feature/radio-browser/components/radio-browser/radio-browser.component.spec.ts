import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RadioBrowserComponent } from './radio-browser.component';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner';
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table';
import { FormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideMockStore } from '@ngrx/store/testing';
import { initialRadioBrowserSearchRootState } from '../../models/initial-radio-browser-search-root-state';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatLegacyAutocompleteModule as MatAutocompleteModule } from '@angular/material/legacy-autocomplete';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { ConfigService } from '@core/services';
import { ConfigStubService } from '@core/testing';
import { StationIconStubDirective } from '@shared/testing';

describe('RadioBrowserComponent', () => {
  let component: RadioBrowserComponent;
  let fixture: ComponentFixture<RadioBrowserComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [RadioBrowserComponent, StationIconStubDirective],
        imports: [
          MatFormFieldModule,
          MatTableModule,
          MatFormFieldModule,
          MatInputModule,
          MatProgressSpinnerModule,
          MatCardModule,
          MatSelectModule,
          MatAutocompleteModule,
          NgxMatSelectSearchModule,
          FormsModule,
          NoopAnimationsModule,
        ],
        providers: [
          provideMockStore({
            initialState: initialRadioBrowserSearchRootState,
          }),
          { provide: ConfigService, useClass: ConfigStubService },
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(RadioBrowserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
