import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Severities } from '../models/notifications/severities';
import { ToasterReadyService } from './notifications/toaster-ready.service';

/** Convenience wrapper around the PrimeNG MessageService */
@Injectable({providedIn: 'root'})
export class NotificationService {
  constructor(private messageService: MessageService, private toasterReadyService: ToasterReadyService) {}

  /** Passes the specified notification on to the PrimeNG MessageService */
  public notify(severity: Severities, summary: string, detail: string = null, life: number = 3000) {
    // If we pass a notification before the toaster component initializes, it won't be displayed at all
    this.toasterReadyService.toasterReady$.subscribe(() => {
      this.messageService.add({severity: severity.toString(), summary, detail, life});
    });
  }
}
