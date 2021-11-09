import { TestBed } from '@angular/core/testing';
import { UnhandledErrorService } from './unhandled-error.service';

describe('UnhandledErrorService', () => {
  let service: UnhandledErrorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UnhandledErrorService],
    });
    service = TestBed.inject(UnhandledErrorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
