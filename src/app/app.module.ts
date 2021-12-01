import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { CoreModule } from '@core';
import { ConfirmationService } from 'primeng/api';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RootComponentsModule } from '@root-components';
import { SharedModule } from '@shared';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AppInitializerService } from './modules/core/services/app-initializer.service';

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
    {
      provide: APP_INITIALIZER,
      deps: [AppInitializerService],
      useFactory: (service: AppInitializerService) => service.initialize,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
