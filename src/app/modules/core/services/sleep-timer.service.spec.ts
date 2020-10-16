import {
    TestBed,
    fakeAsync,
    tick,
    discardPeriodicTasks,
} from '@angular/core/testing';
import { SleepTimerService } from './sleep-timer.service';
import { provideMockActions } from '@ngrx/effects/testing';
import { CurrentTimeService } from './current-time.service';
import { Subject } from 'rxjs';
import { Action } from '@ngrx/store';
import { CoreSpyFactories } from '@core/testing';
import { TestScheduler } from 'rxjs/testing';
import { NotificationsService } from './notifications/notifications.service';

describe('SleepTimerService', () => {
    let sleepTimerService: SleepTimerService;
    const actions$ = new Subject<Action>();
    let currentTimeService: jasmine.SpyObj<CurrentTimeService>;
    let testScheduler: TestScheduler;

    beforeEach(() => {
        testScheduler = new TestScheduler((actual, expected) => {
            expect(actual).toEqual(expected);
        });
        currentTimeService = CoreSpyFactories.createCurrentTimeServiceSpy();

        TestBed.configureTestingModule({
            providers: [
                provideMockActions(() => actions$),
                { provide: CurrentTimeService, useValue: currentTimeService },
                {
                    provide: NotificationsService,
                    useValue: CoreSpyFactories.createNotificationsServiceSpy(),
                },
            ],
        });
        sleepTimerService = TestBed.inject(SleepTimerService);
    });

    it('should be created', () => {
        expect(sleepTimerService).toBeTruthy();
    });

    describe('minutesToSleep$', () => {
        it('should emit the number of minutes until expiration once per minute until sleepTime', () => {
            testScheduler.run((helpers) => {
                // Arrange
                currentTimeService.unixMs.and.returnValue(1596391847549);
                const expectedDiagram =
                    'a 59999ms b 59999ms c 59999ms d 59999ms e 59999ms f';
                const expectedValues = {
                    a: 4,
                    b: 3,
                    c: 2,
                    d: 1,
                    e: 0,
                    f: null,
                };

                // Act
                sleepTimerService.setTimer(5); // 1596391847549 + 5 minutes = 1596392147549

                // Assert
                helpers
                    .expectObservable(sleepTimerService.minutesToSleep$)
                    .toBe(expectedDiagram, expectedValues);
            });
        });

        it('should account for a remainder if the subscription was not started on an exact multiple of 60ms before sleep time', () => {
            testScheduler.run((helpers) => {
                // Arrange
                currentTimeService.unixMs.and.returnValue(1596391847549);
                const expectedDiagram =
                    'a 29999ms b 59999ms c 59999ms d 59999ms e 59999ms f';
                const expectedValues = {
                    a: 4,
                    b: 3,
                    c: 2,
                    d: 1,
                    e: 0,
                    f: null,
                };
                // Act
                sleepTimerService.setTimer(5);
                // Advance time by 30s to simulate waiting before subscribing
                currentTimeService.unixMs.and.returnValue(1596391877549);

                // Assert
                helpers
                    .expectObservable(sleepTimerService.minutesToSleep$)
                    .toBe(expectedDiagram, expectedValues);
            });
        });

        it('should emit null if no sleep timer is set', () => {
            testScheduler.run((helpers) => {
                // Arrange
                currentTimeService.unixMs.and.returnValue(1596391847549);
                const expectedDiagram = 'a';
                const expectedValues = { a: null };

                // Act & Assert
                helpers
                    .expectObservable(sleepTimerService.minutesToSleep$)
                    .toBe(expectedDiagram, expectedValues);
            });
        });

        it('should emit null and then stop emitting if the sleep timer is cleared before sleepTime', fakeAsync(() => {
            // Arrange
            const minutesSpy = jasmine.createSpy('minutes');
            sleepTimerService.minutesToSleep$.subscribe((val) =>
                minutesSpy(val)
            );
            currentTimeService.unixMs.and.returnValue(1596391847549);

            // Act
            sleepTimerService.setTimer(5);

            tick(60000);
            sleepTimerService.clearSleepTimer();

            // Assert
            expect(minutesSpy.calls.allArgs()).toEqual([
                [null],
                [4],
                [3],
                [null],
            ]);

            // Cleanup
            discardPeriodicTasks();
        }));
    });

    describe('sleepTimer$', () => {
        it('should emit after the designated sleep delay', fakeAsync(() => {
            // Arrange
            const sleepTimerSpy = jasmine.createSpy('sleepTimer');
            sleepTimerService.sleepTimer$.subscribe((val) =>
                sleepTimerSpy(val)
            );
            currentTimeService.unixMs.and.returnValue(1596391847549);

            // Act
            sleepTimerService.setTimer(5);

            tick(299999);
            expect(sleepTimerSpy).not.toHaveBeenCalled();

            tick(1);
            expect(sleepTimerSpy).toHaveBeenCalledTimes(1);

            // Assert
            discardPeriodicTasks();
        }));

        it('should not emit if the timer was cleared before sleepTime', fakeAsync(() => {
            // Arrange
            const sleepTimerSpy = jasmine.createSpy('sleepTimer');
            sleepTimerService.sleepTimer$.subscribe((val) =>
                sleepTimerSpy(val)
            );
            currentTimeService.unixMs.and.returnValue(1596391847549);

            // Act
            sleepTimerService.setTimer(2);

            tick(119999);
            sleepTimerService.clearSleepTimer();

            tick(2);

            // Assert
            expect(sleepTimerSpy).not.toHaveBeenCalled();

            // Cleanup
            discardPeriodicTasks();
        }));

        it('should do nothing if no sleep timer is set', fakeAsync(() => {
            // Arrange
            const sleepTimerSpy = jasmine.createSpy('sleepTimer');
            sleepTimerService.sleepTimer$.subscribe((val) =>
                sleepTimerSpy(val)
            );
            currentTimeService.unixMs.and.returnValue(1596391847549);

            // Act
            tick(121000);

            // Assert
            expect(sleepTimerSpy).not.toHaveBeenCalled();

            // Cleanup
            discardPeriodicTasks();
        }));
    });
});
