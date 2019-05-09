import { NgModule, APP_INITIALIZER } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfigService } from './services/config.service';

export function initializeConfig(configService: ConfigService) {
    return () => configService.initialize();
}

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [
    ConfigService,
    { provide: APP_INITIALIZER, useFactory: initializeConfig, deps: [ConfigService], multi: true }
  ]
})
export class ConfigModule {}

export { ConfigService } from './services/config.service';
