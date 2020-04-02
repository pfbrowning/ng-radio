import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoggingService } from './services/logging.service';

@NgModule({
  imports: [
    CommonModule,
  ],
  providers: [
    LoggingService
  ]
})
export class LoggingModule { }
