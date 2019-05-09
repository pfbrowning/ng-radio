import { ReplaySubject } from 'rxjs';
import { AppError } from '../models/app-error';

export class ErrorHandlingSpyFactories {
  public static CreateErrorHandlingServiceSpy(): any {
    const spy = jasmine.createSpyObj('errorHandlingService', ['handleError']);
    spy['appError'] = new ReplaySubject<AppError>(1);
    return spy;
  }
}
