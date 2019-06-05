import { NgModule, ErrorHandler } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErrorHandlingService } from './services/error-handling.service';
import { UnhandledErrorCatcher } from './services/unhandled-error-catcher';
import { ErrorWindowComponent } from './components/error-window/error-window.component';
import { ModalManagerModule } from '@browninglogic/ng-modal';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [
    ErrorWindowComponent
  ],
  imports: [
    CommonModule,
    ModalManagerModule,
    MatIconModule,
    MatButtonModule
  ],
  providers: [
    ErrorHandlingService,
    UnhandledErrorCatcher,
    { provide: ErrorHandler, useClass: UnhandledErrorCatcher }
  ],
  exports: [
    ErrorWindowComponent
  ]
})
export class ErrorHandlingModule {}

export { ErrorHandlingService, ErrorWindowComponent };
