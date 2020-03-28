import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from './services/notification.service';
import { MessageService } from 'primeng/api';

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [
    MessageService,
    NotificationService
  ]
})

export class NotificationsModule { }

export { NotificationService };
export { Severities } from './models/severities';
