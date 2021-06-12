import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RadioBrowserComponent } from './radio-browser.component';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { FormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideMockStore } from '@ngrx/store/testing';
import { initialRadioBrowserSearchRootState } from '../../models/initial-radio-browser-search-root-state';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
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
