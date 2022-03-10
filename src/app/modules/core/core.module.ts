import { NgModule, ErrorHandler } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
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

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    StoreModule.forRoot(reducers, {
      runtimeChecks: {
        strictStateImmutability: true,
        strictActionImmutability: true,
        strictActionWithinNgZone: true,
      },
    }),
    EffectsModule.forRoot([
      FavoriteStationsEffects,
      PlayerEffects,
      AuthenticationEffects,
      StreamMetadataEffects,
    ]),
    StoreRouterConnectingModule.forRoot(),
    !environment.production ? StoreDevtoolsModule.instrument() : [],
  ],
  providers: [MessageService, NotificationsService],
})
export class CoreModule {}
