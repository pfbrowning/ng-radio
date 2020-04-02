import { LoggingService } from '../services/logging.service';

export function createLoggingServiceSpy(): jasmine.SpyObj<LoggingService> {
  return jasmine.createSpyObj('loggingService', ['logError', 'logInformation', 'logEvent']);
}
