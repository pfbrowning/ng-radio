import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule, inject, provideAppInitializer } from '@angular/core';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { CoreModule, UnhandledErrorService } from '@core';
import { ConfirmationService } from 'primeng/api';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RootComponentsModule } from '@root-components';
import { SharedModule } from '@shared';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AppInitializerService } from './modules/core/services/app-initializer.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { BearerTokenService } from '@core/services';
import { providePrimeNG } from 'primeng/config';

import Aura from '@primeng/themes/aura';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    CoreModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ToastModule,
    ConfirmDialogModule,
    SharedModule,
    RootComponentsModule,
    MatToolbarModule,
    MatSidenavModule,
    MatIconModule,
    MatButtonModule,
  ],
  providers: [
    ConfirmationService,
    provideAppInitializer(() => {
      const initializerFn = ((service: AppInitializerService) => service.initialize)(
        inject(AppInitializerService)
      );
      return initializerFn();
    }),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: BearerTokenService,
      multi: true,
    },
    { provide: ErrorHandler, useClass: UnhandledErrorService },
    providePrimeNG({
      theme: {
        preset: Aura,
      },
    }),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
