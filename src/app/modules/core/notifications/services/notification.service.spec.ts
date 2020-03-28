import { TestBed } from '@angular/core/testing';
import { NotificationService } from '@notifications';
import { Severities } from '../models/severities';
import { MessageService } from 'primeng/api';
import { createMessageServiceSpy } from '../testing/notifications-spy-factories.spec';

describe('NotificationService', () => {
  let notificationService: NotificationService;
  let messageServiceSpy: any;

  beforeEach(() => {
    messageServiceSpy = createMessageServiceSpy();

    TestBed.configureTestingModule({
      providers: [
        { provide: MessageService, useValue: messageServiceSpy },
      ]
    });

    notificationService = TestBed.inject(NotificationService);
  });

  const testEntries = [
    { severity: Severities.Error, summary: 'summary 1', detail: 'detail 1', life: 5 },
    { severity: Severities.Info, summary: 'second summary', detail: 'second detail', life: 32 },
    { severity: Severities.Success, summary: 'another summary', detail: 'another detail', life: 3587 },
    { severity: Severities.Warn, summary: 'summary 4', detail: 'detail 4', life: 9001 }
  ];

  it('should be created', () => {
    expect(notificationService).toBeTruthy();
  });

  it('should pass on a few different notifications', () => {
    let iteration = 1;
    /* For each test entry, pass it on to the notify method and ensure that it was properly passed on
    to the PrimeNG MessageService's add method. */
    testEntries.forEach(testEntry => {
      notificationService.notify(testEntry.severity, testEntry.summary, testEntry.detail, testEntry.life);
      expect(messageServiceSpy.add).toHaveBeenCalledTimes(iteration);
      expect(messageServiceSpy.add.calls.mostRecent().args).toEqual([
        { severity: testEntry.severity.toString(), summary: testEntry.summary, detail: testEntry.detail, life: testEntry.life }
      ]);
      iteration++;
    });

    expect(messageServiceSpy.add).toHaveBeenCalledTimes(testEntries.length);
  });
});
