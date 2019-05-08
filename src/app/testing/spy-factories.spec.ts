import { ReplaySubject } from 'rxjs';
import { AppError } from '../models/app-error';

export class SpyFactories {
  public static CreateErrorHandlingServiceSpy(): any {
    const spy = jasmine.createSpyObj('errorHandlingService', ['handleError']);
    spy['appError'] = new ReplaySubject<AppError>(1);
    return spy;
  }

  public static CreateNotificationServiceSpy(): any {
    const spy = jasmine.createSpyObj('notificationServiceSpy', ['notify']);
    return spy;
  }

  public static CreateKeepAwakeServiceSpy(): any {
    return jasmine.createSpyObj('keepAwakeServiceSpy', ['enable', 'disable']);
  }

  public static CreateMessageServiceSpy(): any {
    return jasmine.createSpyObj('messageServiceSpy', ['add']);
  }

  public static CreateAppInsightsServiceSpy(): any {
    return jasmine.createSpyObj('appInsightsService', ['trackException', 'trackEvent']);
  }

  public static CreateLoggingServiceSpy(): any {
    return jasmine.createSpyObj('loggingService', ['logException', 'logEvent']);
  }
}
