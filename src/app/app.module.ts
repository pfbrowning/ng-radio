import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { ModalManagerModule } from '@browninglogic/ng-modal';
import { NgLoadingIndicatorModule } from '@browninglogic/ng-loading-indicator';
import { CoreRadioLogicModule } from '@core-radio-logic';
import { ConfigModule } from '@config';
import { ErrorHandlingModule } from '@error-handling';
import { LoggingModule } from '@logging';
import { KeepAwakeModule } from '@keep-awake';
import { NotificationsModule } from '@notifications';
import { SharedComponentsModule } from '@shared-components';
import { AuthenticationModule } from '@authentication';
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
