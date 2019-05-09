import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CustomStationComponent } from './components/custom-station/custom-station.component';
import { CustomStationRoutingModule } from './custom-station-routing.module';
import { MatButtonModule, MatFormFieldModule, MatInputModule } from '@angular/material';

@NgModule({
  declarations: [
    CustomStationComponent
  ],
  imports: [
    CommonModule,
    CustomStationRoutingModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ]
})
export class CustomStationModule { }
