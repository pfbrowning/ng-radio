import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FavoriteStationsComponent } from './components/favorite-stations/favorite-stations.component'
import { FavoriteStationsRoutingModule } from './favorite-stations-routing.module'
import { MatTableModule } from '@angular/material/table'
import { MatButtonModule } from '@angular/material/button'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { SharedModule } from '@shared'
import { MatIconModule } from '@angular/material/icon'
import { MatTooltipModule } from '@angular/material/tooltip'
import { EffectsModule } from '@ngrx/effects'
import { FavoriteStationsFeatureEffects } from './store/effects'

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
