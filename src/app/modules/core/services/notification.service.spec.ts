import { TestBed } from '@angular/core/testing';
import { NotificationService } from '../services/notification.service';
import { Severities } from '../models/notifications/severities';
import { MessageService } from 'primeng/api';
import { createMessageServiceSpy } from '../testing/core-spy-factories.spec';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { initialRootState } from '../models/initial-root-state';
import { RootState } from '../models/root-state';
import { ApplicationSelectors } from '../store/application';
import theoretically from 'jasmine-theories';

describe('NotificationService', () => {
  let notificationService: NotificationService;
  let messageServiceSpy: any;
  let store: MockStore<RootState>;

  beforeEach(() => {
    messageServiceSpy = createMessageServiceSpy();

    TestBed.configureTestingModule({
      providers: [
        { provide: MessageService, useValue: messageServiceSpy },
        provideMockStore({initialState: initialRootState}),
      ]
    });

    notificationService = TestBed.inject(NotificationService);
    store = TestBed.inject(MockStore);
  });

  afterEach(() => {
    store.resetSelectors();
  });


  it('should be created', () => {
    expect(notificationService).toBeTruthy();
  });

  const testNotifications = [
    { severity: Severities.Error, summary: 'summary 1', detail: 'detail 1', life: 5 },
    { severity: Severities.Info, summary: 'second summary', detail: 'second detail', life: 32 },
    { severity: Severities.Success, summary: 'another summary', detail: 'another detail', life: 3587 },
    { severity: Severities.Warn, summary: 'summary 4', detail: 'detail 4', life: 9001 }
  ];
  theoretically.it('Should pass notifications to messageService', testNotifications, (notification) => {
    // Arrange
    store.overrideSelector(ApplicationSelectors.toasterInitialized, true);

    // Act
    notificationService.notify(notification.severity, notification.summary, notification.detail, notification.life);

    // Assert
    expect(messageServiceSpy.add).toHaveBeenCalledTimes(1);
    expect(messageServiceSpy.add.calls.mostRecent().args).toEqual([
      { severity: notification.severity.toString(), summary: notification.summary, detail: notification.detail, life: notification.life }
    ]);
  });

  it('Should wait for toaster initialization before passing a message', () => {
    // Arrange
    const initialized = store.overrideSelector(ApplicationSelectors.toasterInitialized, false);
    notificationService.notify(Severities.Info, 'Summary', 'Detail');
    expect(messageServiceSpy.add).not.toHaveBeenCalled();

    // Act
    initialized.setResult(true);
    store.refreshState();

    // Assert
    expect(messageServiceSpy.add).toHaveBeenCalledTimes(1);
  });
});
