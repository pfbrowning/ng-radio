import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { environment } from '@environment';
import { FavoriteStationsEffects } from './store/favorite-stations/favorite-stations.effects';
import { PlayerEffects } from './store/player/player.effects';
import { AuthenticationEffects } from './store/authentication/authentication.effects';
import { StreamMetadataEffects } from './store/stream-metadata/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { MessageService } from 'primeng/api';
import { reducers } from './store/reducers';
import { NotificationsService } from '@core/services';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { ConfigEffects } from './store/config/config.effects';
import { SocketIOMessageListenerEffects } from './store/socket-io/effects/socket-io-message-listener.effects';

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
      ConfigEffects,
      SocketIOMessageListenerEffects,
    ]),
    StoreRouterConnectingModule.forRoot(),
    !environment.production ? StoreDevtoolsModule.instrument({ connectInZone: true }) : [],
  ],
  providers: [MessageService, NotificationsService],
})
export class CoreModule {}
