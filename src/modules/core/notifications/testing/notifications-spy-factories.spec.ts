import { Subject } from 'rxjs';
import { NotificationService } from '../services/notification.service';
import { MessageService } from 'primeng/api';

export function createNotificationServiceSpy(): jasmine.SpyObj<NotificationService> {
  return jasmine.createSpyObj('notificationServiceSpy', ['notify']);
}

export function createMessageServiceSpy(): jasmine.SpyObj<MessageService> {
  const spy = jasmine.createSpyObj('messageServiceSpy', ['add']);
  spy['messageObserver'] = new Subject();
  spy['clearObserver'] = new Subject();
  return spy;
}