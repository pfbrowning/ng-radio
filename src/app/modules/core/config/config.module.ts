import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfigService } from './services/config.service';
import { HttpClientModule } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { configReducer } from './store/config.reducer';
import { ConfigEffects } from './store/config.effects';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    StoreModule.forFeature('config', configReducer),
    EffectsModule.forFeature([ConfigEffects])
  ],
  providers: [
    ConfigService
  ]
})
export class ConfigModule {}
