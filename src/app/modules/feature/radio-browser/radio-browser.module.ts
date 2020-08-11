import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RadioBrowserRoutingModule } from './radio-browser-routing.module';
import { RadioBrowserComponent } from './components/radio-browser/radio-browser.component';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { StoreModule } from '@ngrx/store';
import { radioBrowserSearchReducer, radioBrowserSearchFeatureKey } from './store/radio-browser.reducer';
import { EffectsModule } from '@ngrx/effects';
import { RadioBrowserSearchEffects } from './store/radio-browser.effects';
import { SharedModule } from '@shared';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

@NgModule({
  declarations: [
    RadioBrowserComponent
  ],
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
    EffectsModule.forFeature([RadioBrowserSearchEffects])
  ]
})
export class RadioBrowserModule {}
