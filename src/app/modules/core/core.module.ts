import { NgModule, ErrorHandler } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StreamInfoService } from './services/stream-info.service';
import { AudioElementToken } from './injection-tokens/audio-element-token';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { KeepAwakeService } from './services/keep-awake.service';
import { NoSleepToken } from './injection-tokens/no-sleep-token';
import { CurrentTimeService } from './services/current-time.service';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { environment } from '@environment';
import { FavoriteStationsEffects } from './store/favorite-stations/favorite-stations.effects';
import { PlayerEffects } from './store/player/player.effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { SleepTimerEffects } from './store/sleep-timer/sleep-timer.effects';
import { AudioElement } from './models/player/audio-element';
import { AuthenticationEffects } from './store/authentication/authentication.effects';
import { OAuthModule } from 'angular-oauth2-oidc';
import { ConfigService } from './services/config.service';
import { ConfigEffects } from './store/config/config.effects';
import { UnhandledErrorService } from './services/unhandled-error.service';
import { MessageService } from 'primeng/api';
import { NotificationService } from './services/notification.service';
import { ApplicationEffects } from './store/application/application.effects';
import { BearerTokenService } from './services/authentication/bearer-token.service';
import { reducers } from './store/reducers';
import NoSleep from 'nosleep.js';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    OAuthModule.forRoot(),
    StoreModule.forRoot(reducers, {
      runtimeChecks: {
        strictStateImmutability: true,
        strictActionImmutability: true,
        strictActionWithinNgZone: true
      }
    }),
    EffectsModule.forRoot([
      FavoriteStationsEffects,
      PlayerEffects,
      SleepTimerEffects,
      AuthenticationEffects,
      ConfigEffects,
      ApplicationEffects
    ]),
    !environment.production ? StoreDevtoolsModule.instrument() : [],
    StoreRouterConnectingModule.forRoot(),
  ],
  providers: [
    StreamInfoService,
    KeepAwakeService,
    CurrentTimeService,
    ConfigService,
    MessageService,
    NotificationService,
    { provide: NoSleepToken, useValue: new NoSleep() },
    { provide: AudioElementToken, useValue: new AudioElement() },
    { provide: HTTP_INTERCEPTORS, useClass: BearerTokenService, multi: true },
    { provide: ErrorHandler, useClass: UnhandledErrorService }
  ]
})
export class CoreModule {}
