import { TestBed } from '@angular/core/testing';
import { RouterStateService } from './router-state.service';
import { RouterTestingModule } from '@angular/router/testing';

describe('RouterStateService', () => {
  let service: RouterStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
    });
    service = TestBed.inject(RouterStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
