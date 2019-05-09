import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RadioBrowserRoutingModule } from './radio-browser-routing.module';
import { RadioBrowserComponent } from './components/radio-browser/radio-browser.component';
import { MatTableModule, MatFormFieldModule, MatInputModule, MatTooltipModule,
  MatProgressSpinnerModule, MatCardModule } from '@angular/material';

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
