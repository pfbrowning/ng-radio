import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Severities } from '../../models/notifications/severities';
import { ToasterReadyService } from './toaster-ready.service';

/** Convenience wrapper around the PrimeNG MessageService */
@Injectable({ providedIn: 'root' })
export class NotificationsService {
    constructor(
        private messageService: MessageService,
        private toasterReadyService: ToasterReadyService
    ) {}

    /** Passes the specified notification on to the PrimeNG MessageService */
    private notify(
        severity: Severities,
        summary: string,
        detail?: string,
        life?: number
    ) {
        life = life || 3000;
        // If we pass a notification before the toaster component initializes, it won't be displayed at all
        this.toasterReadyService.toasterReady$.subscribe(() => {
            this.messageService.add({
                severity: severity.toString(),
                summary,
                detail,
                life,
            });
        });
    }

    public success(summary: string, detail?: string, life?: number) {
        this.notify(Severities.Success, summary, detail, life);
    }

    public info(summary: string, detail?: string, life?: number) {
        this.notify(Severities.Info, summary, detail, life);
    }

    public warn(summary: string, detail?: string, life?: number) {
        this.notify(Severities.Warn, summary, detail, life);
    }

    public error(summary: string, detail?: string, life?: number) {
        this.notify(Severities.Error, summary, detail, life);
    }
}
