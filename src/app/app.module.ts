import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { CoreModule, ConfigService, AppInsightsService } from '@core';
import { ConfirmationService } from 'primeng/api';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RootComponentsModule } from '@root-components';
import { SharedModule } from '@shared';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { appInitializer } from './app-initializer';

@NgModule({
  declarations: [
    AppComponent
  ],
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
    MatButtonModule
  ],
  providers: [
    ConfirmationService,
    { provide: APP_INITIALIZER, useFactory: appInitializer, deps: [ConfigService, AppInsightsService], multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
