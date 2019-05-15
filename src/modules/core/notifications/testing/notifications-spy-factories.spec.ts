import { Subject } from 'rxjs';

export class NotificationsSpyFactories {
    public static CreateNotificationServiceSpy(): any {
      const spy = jasmine.createSpyObj('notificationServiceSpy', ['notify']);
      return spy;
    }

    public static CreateMessageServiceSpy(): any {
      const spy = jasmine.createSpyObj('messageServiceSpy', ['add']);
      spy['messageObserver'] = new Subject();
      spy['clearObserver'] = new Subject();
      return spy;
    }
  }

