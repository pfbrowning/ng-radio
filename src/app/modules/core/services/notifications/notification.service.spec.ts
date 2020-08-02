import { TestBed } from '@angular/core/testing';
import { Severities } from '../../models/notifications/severities';
import { MessageService } from 'primeng/api';
import theoretically from 'jasmine-theories';
import { CoreSpyFactories } from '@core/testing';
import { ToasterReadyStubService } from '@core/testing';
import { NotificationService, ToasterReadyService } from '@core/services';

describe('NotificationService', () => {
  let notificationService: NotificationService;
  let messageServiceSpy: any;
  let toasterReadyService: ToasterReadyStubService;

  beforeEach(() => {
    messageServiceSpy = CoreSpyFactories.createMessageServiceSpy();
    toasterReadyService = new ToasterReadyStubService();

    TestBed.configureTestingModule({
      providers: [
        { provide: MessageService, useValue: messageServiceSpy },
        { provide: ToasterReadyService, useValue: toasterReadyService }
      ]
    });

    notificationService = TestBed.inject(NotificationService);
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
    toasterReadyService.toasterReadySource.next();

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
    notificationService.notify(Severities.Info, 'Summary', 'Detail');
    expect(messageServiceSpy.add).not.toHaveBeenCalled();

    // Act
    toasterReadyService.toasterReadySource.next();

    // Assert
    expect(messageServiceSpy.add).toHaveBeenCalledTimes(1);
  });
});
