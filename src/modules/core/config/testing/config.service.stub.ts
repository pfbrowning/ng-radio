import { Subject } from 'rxjs';
import { IAppConfig } from '../models/app-config';

export class ConfigServiceStub {
  public loaded$ = new Subject<IAppConfig>();
  public appConfig: IAppConfig;
  public initialized = true;
}
