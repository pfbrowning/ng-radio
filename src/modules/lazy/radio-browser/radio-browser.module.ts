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

@NgModule({
  declarations: [
    RadioBrowserComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RadioBrowserRoutingModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatTooltipModule,
    MatCardModule,
    MatProgressSpinnerModule
  ]
})
export class RadioBrowserModule {}
