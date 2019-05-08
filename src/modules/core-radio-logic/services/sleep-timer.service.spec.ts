import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { SleepTimerService } from './sleep-timer.service';
import { NotificationService } from 'src/app/services/notification.service';
import { SpyFactories } from 'src/app/testing/spy-factories.spec';
import { CoreRadioLogicModule } from '../core-radio-logic.module';

describe('SleepTimerService', () => {
  let sleepTimerService: SleepTimerService;
  let sleepEmitSpy: jasmine.Spy;
  let notificationServiceSpy: jasmine.SpyObj<NotificationService>;
  let minutesUntilSleepSpy: jasmine.Spy;

  beforeEach(() => {
    notificationServiceSpy = SpyFactories.CreateNotificationServiceSpy();

    TestBed.configureTestingModule({
      imports: [
        CoreRadioLogicModule
      ],
      providers: [
        { provide: NotificationService, useValue: notificationServiceSpy }
      ]
    });
    sleepTimerService = TestBed.get(SleepTimerService);
    sleepEmitSpy = jasmine.createSpy('sleepEmit');
    minutesUntilSleepSpy = jasmine.createSpy('minutesUntilSleep');
    sleepTimerService.sleep.subscribe(() => sleepEmitSpy());
    sleepTimerService.minutesUntilSleep$.subscribe(minutes => minutesUntilSleepSpy(minutes));
  });

  it('should be created', () => {
    expect(sleepTimerService).toBeTruthy();
  });

  it('should properly handle basic sleep timer set', fakeAsync(() => {
    // Arrange
    const minutes = 85;
    const milliseconds = minutes * 60000;
    // Before setting the timer, no notification should have been triggered
    expect(notificationServiceSpy.notify).not.toHaveBeenCalled();
    // Act: Set the timer
    sleepTimerService.setTimer(minutes);
    // Assert
    // The initial 'Sleep Timer Set' notification should be shown
    expect(notificationServiceSpy.notify).toHaveBeenCalledTimes(1);
    expect(notificationServiceSpy.notify.calls.mostRecent().args[1]).toBe('Sleep Timer Set');

    // Up until the millisecond before sleep time, the sleep event should not have been emitted
    tick(milliseconds - 1);
    expect(sleepEmitSpy).not.toHaveBeenCalled();
    // Immediately upon the sleep time, the sleep event should be emitted.
    tick(1);
    expect(sleepEmitSpy).toHaveBeenCalledTimes(1);
    // The 'Going to sleep' notification should also have been shown
    expect(notificationServiceSpy.notify).toHaveBeenCalledTimes(2);
    expect(notificationServiceSpy.notify.calls.mostRecent().args[1]).toBe('Going to sleep');
  }));

  it('should emit minutes until sleep on a per-minute interval', fakeAsync(() => {
    // Arrange
    const minutes = 85;
    // Minutes until sleep should have been called once from the initial subscription
    expect(minutesUntilSleepSpy).toHaveBeenCalledTimes(1);
    // Act: set the sleep timer
    sleepTimerService.setTimer(minutes);
    // Assert
    // It should have been called again here because clearTimer emits null during setTimer
    expect(minutesUntilSleepSpy).toHaveBeenCalledTimes(2);

    /* Wait for the initial 1 ms in order to ensure that the
    remaining minutes is totalMinutes - 1 when starting*/
    tick(1);
    // For each minute counting down to zero
    for (let i = minutes - 1; i >= 0; i--) {
      // minutesUntilSleep should have just emitted the updated minute count
      expect(minutesUntilSleepSpy.calls.mostRecent().args[0]).toBe(i);
      // Wait 1 minute before continuing to the next iteration
      tick(60000);
    }

    /* MinutesUntilSleep should have emitted [minutes + 3] times by now:
    -Once for the initial subscription
    -Once for the initial clearTimer called by setTimer
    -Once for the final clearTimer called by goToSleep
    -once for each minute */
    expect(minutesUntilSleepSpy).toHaveBeenCalledTimes(minutes + 3);
  }));

  it('should properly clear the current timer', fakeAsync(() => {
    // Arrange
    const minutes = 85;
    const milliseconds = minutes * 60000;
    // Act: Set a timer and then cancel it
    sleepTimerService.setTimer(minutes);
    sleepTimerService.cancelTimer();
    // Assert
    // Cancellation notification should have been shown
    expect(notificationServiceSpy.notify).toHaveBeenCalledTimes(2);
    expect(notificationServiceSpy.notify.calls.mostRecent().args[1]).toBe('Sleep Timer Cancelled');

    // Wait until 1 ms after the timer period
    tick(milliseconds + 1);
    // The Sleep event still should not have been emitted.
    expect(sleepEmitSpy).not.toHaveBeenCalled();
  }));

  it('should maintain only one sleep timer at a time', fakeAsync(() => {
    // Arrange
    const minutes = 85;
    const milliseconds = minutes * 60000;
    // Act: Set the sleep timer once for a short time, then for a longer time
    sleepTimerService.setTimer(3);
    sleepTimerService.setTimer(minutes);

    // Assert
    /* 1 ms before the longer timer interval, sleep should not
    have been emitted. */
    tick(milliseconds - 1);
    expect(sleepEmitSpy).not.toHaveBeenCalled();
    // Immediately on the timer interval, sleep should be emitted once.
    tick(1);
    expect(sleepEmitSpy).toHaveBeenCalledTimes(1);
  }));
});
