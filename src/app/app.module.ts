import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { ModalManagerModule } from '@browninglogic/ng-modal';
import { NgLoadingIndicatorModule } from '@browninglogic/ng-loading-indicator';
import { CoreModule } from '@core';
import { ConfigModule } from '@config';
import { ErrorHandlingModule } from '@error-handling';
import { LoggingModule } from '@logging';
import { NotificationsModule } from '@notifications';
import { AuthenticationModule } from '@authentication';
import { ConfirmationService } from 'primeng/api';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RootComponentsModule } from '@root-components';
import { SharedModule } from '@shared';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    ConfigModule,
    AuthenticationModule,
    CoreModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ToastModule,
    ConfirmDialogModule,
    ModalManagerModule,
    NgLoadingIndicatorModule,
    ErrorHandlingModule,
    LoggingModule,
    NotificationsModule,
    SharedModule,
    RootComponentsModule,
    MatToolbarModule,
    MatSidenavModule,
    MatIconModule,
    MatButtonModule
  ],
  providers: [
    ConfirmationService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
