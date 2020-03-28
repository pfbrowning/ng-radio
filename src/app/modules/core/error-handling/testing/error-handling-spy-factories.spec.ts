import { ReplaySubject } from 'rxjs';
import { AppError } from '../models/app-error';

export function createErrorHandlingServiceSpy(): any {
  const spy = jasmine.createSpyObj('errorHandlingService', ['handleError']);
  spy['appError'] = new ReplaySubject<AppError>(1);
  return spy;
}
