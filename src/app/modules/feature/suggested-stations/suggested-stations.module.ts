import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SuggestedStationsRoutingModule } from './suggested-stations-routing.module';
import { SuggestedStationsComponent } from './components/suggested-stations/suggested-stations.component';
import { SuggestedStationsSectionComponent } from './components/suggested-stations-section/suggested-stations-section.component';
import { StationThumbnailComponent } from './components/station-thumbnail/station-thumbnail.component';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { suggestedStationsFeatureKey, suggestedStationsReducer } from './store/suggested-stations.reducer';
import { SuggestedStationsEffects } from './store/suggested-stations.effects';

@NgModule({
  declarations: [
    SuggestedStationsComponent,
    SuggestedStationsSectionComponent,
    StationThumbnailComponent
  ],
  imports: [
    CommonModule,
    SuggestedStationsRoutingModule,
    StoreModule.forFeature(suggestedStationsFeatureKey, suggestedStationsReducer),
    EffectsModule.forFeature([SuggestedStationsEffects])
  ]
})
export class SuggestedStationsModule { }
