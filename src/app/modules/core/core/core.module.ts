import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StationLookupService } from './services/station-lookup.service';
import { StreamInfoService } from './services/stream-info.service';
import { AudioElementToken } from './injection-tokens/audio-element-token';
import { HttpClientModule } from '@angular/common/http';
import { KeepAwakeService } from './services/keep-awake.service';
import { NoSleepToken } from './injection-tokens/no-sleep-token';
import { WindowToken } from './injection-tokens/window-token';
import { CurrentTimeService } from './services/current-time.service';
import { StoreRouterConnectingModule, routerReducer } from '@ngrx/router-store';
import { StoreModule } from '@ngrx/store';
import { favoriteStationsReducer } from './store/favorite-stations/favorite-stations.reducer';
import { playerReducer } from './store/player/player.reducer';
import { EffectsModule } from '@ngrx/effects';
import { environment } from 'src/environments/environment';
import { FavoriteStationsEffects } from './store/favorite-stations/favorite-stations.effects';
import { PlayerEffects } from './store/player/player.effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { sleepTimerReducer } from './store/sleep-timer/sleep-timer.reducer';
import { SleepTimerEffects } from './store/sleep-timer/sleep-timer.effects';
import { AudioElement } from './services/audio-element';
import { authenticationReducer } from './store/authentication/authentication.reducer';
import { AuthenticationEffects } from './store/authentication/authentication.effects';
import { OAuthModule } from 'angular-oauth2-oidc';
import { AuthGuard } from './guards/auth.guard';
import { routerExtendedReducer } from './store/router-extended/router-extended.reducer';
import { RouterExtendedEffects } from './store/router-extended/router-extended.effects';
import * as NoSleep from 'nosleep.js';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    OAuthModule.forRoot(),
    StoreModule.forRoot({
      router: routerReducer,
      routerExtended: routerExtendedReducer,
      favoriteStations: favoriteStationsReducer,
      player: playerReducer,
      sleepTimer: sleepTimerReducer,
      authentication: authenticationReducer
    }, {
      runtimeChecks: {
        strictStateImmutability: true,
        strictActionImmutability: true,
      }
    }),
    EffectsModule.forRoot([FavoriteStationsEffects, PlayerEffects, SleepTimerEffects, AuthenticationEffects, RouterExtendedEffects]),
    !environment.production ? StoreDevtoolsModule.instrument() : [],
    StoreRouterConnectingModule.forRoot(),
  ],
  providers: [
    StationLookupService,
    StreamInfoService,
    KeepAwakeService,
    CurrentTimeService,
    AuthGuard,
    { provide: NoSleepToken, useValue: new NoSleep() },
    { provide: AudioElementToken, useValue: new AudioElement() },
    { provide: WindowToken, useValue: window },
  ]
})
export class CoreModule {}
