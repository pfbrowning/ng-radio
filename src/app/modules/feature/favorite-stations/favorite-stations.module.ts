import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FavoriteStationsComponent } from './components/favorite-stations/favorite-stations.component';
import { FavoriteStationsRoutingModule } from './favorite-stations-routing.module';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
  declarations: [FavoriteStationsComponent],
  imports: [
    CommonModule,
    FavoriteStationsRoutingModule,
    MatTableModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ]
})
export class FavoriteStationsModule { }
