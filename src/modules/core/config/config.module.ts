import { NgModule, APP_INITIALIZER } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfigService } from './services/config.service';
import { HttpClientModule } from '@angular/common/http';

export function initializeConfig(configService: ConfigService) {
    return () => configService.initialize().toPromise();
}

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HttpClientModule
  ],
  providers: [
    ConfigService,
    { provide: APP_INITIALIZER, useFactory: initializeConfig, deps: [ConfigService], multi: true }
  ]
})
export class ConfigModule {}

export { ConfigService } from './services/config.service';
