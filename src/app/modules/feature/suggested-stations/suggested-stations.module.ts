import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SuggestedStationsRoutingModule } from './suggested-stations-routing.module';
import { SuggestedStationsComponent } from './components/suggested-stations/suggested-stations.component';
import { SuggestedStationsSectionComponent } from './components/suggested-stations-section/suggested-stations-section.component';
import { StationThumbnailComponent } from './components/station-thumbnail/station-thumbnail.component';

@NgModule({
  declarations: [
    SuggestedStationsComponent,
    SuggestedStationsSectionComponent,
    StationThumbnailComponent
  ],
  imports: [
    CommonModule,
    SuggestedStationsRoutingModule
  ]
})
export class SuggestedStationsModule { }
