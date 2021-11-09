import { TestBed } from '@angular/core/testing';
import { RadioBrowserSearchFacadeService } from './radio-browser-search-facade.service';
import { provideMockStore } from '@ngrx/store/testing';
import { initialRootState } from '@core';

describe('RadioBrowserSearchFacadeService', () => {
  let service: RadioBrowserSearchFacadeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({ initialState: initialRootState })],
    });
    service = TestBed.inject(RadioBrowserSearchFacadeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
