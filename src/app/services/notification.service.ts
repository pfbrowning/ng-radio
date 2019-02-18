import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({providedIn: 'root'})
export class NotificationService {
  constructor(private messageService: MessageService) {}

  public notify(severity: Severities, summary: string, detail: string, life: number = 3000) {
    this.messageService.add({severity: severity.toString(), summary: summary, detail: detail, life: life});
  }
}

export enum Severities { 
  Success = 'success',
  Info = 'info', 
  Warn = 'warn', 
  Error = 'error'
}