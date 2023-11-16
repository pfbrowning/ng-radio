import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RadioBrowserRoutingModule } from './radio-browser-routing.module';
import { RadioBrowserComponent } from './components/radio-browser/radio-browser.component';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner';
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
import { StoreModule } from '@ngrx/store';
import { radioBrowserSearchReducer, radioBrowserSearchFeatureKey } from './store/reducer';
import { EffectsModule } from '@ngrx/effects';
import { RadioBrowserSearchEffects } from './store/effects';
import { SharedModule } from '@shared';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatLegacyAutocompleteModule as MatAutocompleteModule } from '@angular/material/legacy-autocomplete';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

@NgModule({
  declarations: [RadioBrowserComponent],
  imports: [
    CommonModule,
    FormsModule,
    RadioBrowserRoutingModule,
    SharedModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatTooltipModule,
    MatCardModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatAutocompleteModule,
    NgxMatSelectSearchModule,
    StoreModule.forFeature(radioBrowserSearchFeatureKey, radioBrowserSearchReducer),
    EffectsModule.forFeature([RadioBrowserSearchEffects]),
  ],
})
export class RadioBrowserModule {}
