import { BehaviorSubject } from 'rxjs';

export function createKeepAwakeServiceSpy(): any {
  const spy = jasmine.createSpyObj('keepAwakeServiceSpy', ['enable', 'disable']);
  spy['enabled$'] = new BehaviorSubject<boolean>(false);
  return spy;
}
