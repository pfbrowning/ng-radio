import { NgModule, ErrorHandler } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { KeepAwakeService } from './services/keep-awake.service';
import { NoSleepToken } from './injection-tokens/no-sleep-token';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { environment } from '@environment';
import { FavoriteStationsEffects } from './store/favorite-stations/favorite-stations.effects';
import { PlayerEffects } from './store/player/player.effects';
import { AuthenticationEffects } from './store/authentication/authentication.effects';
import { StreamMetadataEffects } from './store/stream-metadata/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { UnhandledErrorService } from './services/unhandled-error.service';
import { MessageService } from 'primeng/api';
import { BearerTokenService } from './services/authentication/bearer-token.service';
import { reducers } from './store/reducers';
import { NotificationsService } from '@core/services';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import NoSleep from 'nosleep.js';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
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
      AuthenticationEffects,
      StreamMetadataEffects
    ]),
    StoreRouterConnectingModule.forRoot(),
    !environment.production ? StoreDevtoolsModule.instrument() : [],
  ],
  providers: [
    KeepAwakeService,
    MessageService,
    NotificationsService,
    { provide: NoSleepToken, useValue: new NoSleep() },
    { provide: HTTP_INTERCEPTORS, useClass: BearerTokenService, multi: true },
    { provide: ErrorHandler, useClass: UnhandledErrorService }
  ]
})
export class CoreModule {}
