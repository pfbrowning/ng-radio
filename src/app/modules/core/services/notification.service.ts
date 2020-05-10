import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Severities } from '../models/notifications/severities';
import { RootState } from '../models/root-state';
import { Store, select } from '@ngrx/store';
import { ApplicationSelectors } from '@core/store';
import { filter, take } from 'rxjs/operators';

/** Convenience wrapper around the PrimeNG MessageService */
@Injectable({providedIn: 'root'})
export class NotificationService {
  constructor(private messageService: MessageService, private store: Store<RootState>) {}

  /** Passes the specified notification on to the PrimeNG MessageService */
  public notify(severity: Severities, summary: string, detail: string = null, life: number = 3000) {
    // If we pass a notification before the toaster component initializes, it won't be displayed at all
    this.store.pipe(select(ApplicationSelectors.toasterInitialized), filter(t => t), take(1)).subscribe(() => {
      this.messageService.add({severity: severity.toString(), summary, detail, life});
    });
  }
}
