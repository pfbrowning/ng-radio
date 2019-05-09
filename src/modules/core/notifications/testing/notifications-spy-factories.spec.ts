export class NotificationsSpyFactories {
    public static CreateNotificationServiceSpy(): any {
      const spy = jasmine.createSpyObj('notificationServiceSpy', ['notify']);
      return spy;
    }
  
    public static CreateMessageServiceSpy(): any {
      return jasmine.createSpyObj('messageServiceSpy', ['add']);
    }
  }
  