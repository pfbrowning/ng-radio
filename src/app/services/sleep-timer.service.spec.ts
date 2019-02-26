import { TestBed } from '@angular/core/testing';
import { SleepTimerService } from './sleep-timer.service';
import { NotificationService } from './notification.service';
import { SpyFactories } from '../testing/spy-factories.spec';

describe('SleepTimerService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      { provide: NotificationService, useValue: SpyFactories.CreateNotificationServiceSpy() }
    ]
  }));

  it('should be created', () => {
    const service: SleepTimerService = TestBed.get(SleepTimerService);
    expect(service).toBeTruthy();
  });
});
