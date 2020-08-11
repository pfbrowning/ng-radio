import { TestBed } from '@angular/core/testing';
import { RadioBrowserSearchFacadeService } from './radio-browser-search-facade.service';

describe('RadioBrowserSearchFacadeService', () => {
  let service: RadioBrowserSearchFacadeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RadioBrowserSearchFacadeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
