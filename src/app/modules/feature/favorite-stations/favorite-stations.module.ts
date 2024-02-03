import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FavoriteStationsComponent } from './components/favorite-stations/favorite-stations.component';
import { FavoriteStationsRoutingModule } from './favorite-stations-routing.module';
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner';
import { SharedModule } from '@shared';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
import { EffectsModule } from '@ngrx/effects';
import { FavoriteStationsFeatureEffects } from './store/effects';

@NgModule({
  declarations: [FavoriteStationsComponent],
  imports: [
    CommonModule,
    FavoriteStationsRoutingModule,
    SharedModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    EffectsModule.forFeature([FavoriteStationsFeatureEffects]),
  ],
})
export class FavoriteStationsModule {}
