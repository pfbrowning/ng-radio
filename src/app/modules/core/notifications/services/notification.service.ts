import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Severities } from '../models/severities';

/** Convenience wrapper around the PrimeNG MessageService */
@Injectable({providedIn: 'root'})
export class NotificationService {
  constructor(private messageService: MessageService) {}

  /** Passes the specified notification on to the PrimeNG MessageService */
  public notify(severity: Severities, summary: string, detail: string, life: number = 3000) {
    this.messageService.add({severity: severity.toString(), summary: summary, detail: detail, life: life});
  }
}
