import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../../../../environments/environment';
import { FavoriteStationsEffects } from './sections/favorite-stations/store/favorite-stations.effects';
import { EffectsModule } from '@ngrx/effects';
import { PlayerEffects } from './sections/player/store/player.effects';
import { SleepTimerEffects } from './sections/sleep-timer/store/sleep-timer.effects';
import { favoriteStationsReducer } from './sections/favorite-stations/store/favorite-stations.reducer';
import { playerReducer } from './sections/player/store/player.reducer';
import { sleepTimerReducer } from './sections/sleep-timer/store/sleep-timer.reducer';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forRoot({
      favoriteStations: favoriteStationsReducer,
      player: playerReducer,
      sleepTimer: sleepTimerReducer
    }, {
      runtimeChecks: {
        strictStateImmutability: true,
        strictActionImmutability: true,
      }
    }),
    EffectsModule.forRoot([FavoriteStationsEffects, PlayerEffects, SleepTimerEffects]),
    !environment.production ? StoreDevtoolsModule.instrument() : []
  ]
})
export class RootStateModule { }
