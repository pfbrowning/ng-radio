import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { ModalManagerModule } from '@browninglogic/ng-modal';
import { NgLoadingIndicatorModule } from '@browninglogic/ng-loading-indicator';
import { CoreRadioLogicModule } from '@modules/core/core-radio-logic/core-radio-logic.module';
import { ConfigModule } from '@modules/core/config/config.module';
import { ErrorHandlingModule } from '@modules/core/error-handling/error-handling.module';
import { LoggingModule } from '@modules/core/logging/logging.module';
import { KeepAwakeModule } from '@modules/core/keep-awake/keep-awake.module';
import { NotificationsModule } from '@modules/core/notifications/notifications.module';
import { SharedComponentsModule } from '@modules/shared/shared-components/shared-components.module';
import { AuthenticationModule } from '@modules/core/authentication/authentication.module';
import { RootStateModule } from '@root-state';
import { ConfirmationService } from 'primeng/api';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    ConfigModule,
    AuthenticationModule,
    CoreRadioLogicModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ToastModule,
    ConfirmDialogModule,
    ModalManagerModule,
    NgLoadingIndicatorModule,
    ErrorHandlingModule,
    LoggingModule,
    KeepAwakeModule,
    NotificationsModule,
    SharedComponentsModule,
    RootStateModule
  ],
  providers: [
    ConfirmationService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
