import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Severities } from '../models/notifications/severities';

/** Convenience wrapper around the PrimeNG MessageService */
@Injectable({providedIn: 'root'})
export class NotificationService {
  constructor(private messageService: MessageService) {}

  /** Passes the specified notification on to the PrimeNG MessageService */
  public notify(severity: Severities, summary: string, detail: string = null, life: number = 3000) {
    // Wait until after change detection in case p-toast hasnt't been initialized yet
    setTimeout(() => this.messageService.add({severity: severity.toString(), summary: summary, detail: detail, life: life}));
  }
}
