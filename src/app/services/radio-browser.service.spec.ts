import { TestBed } from '@angular/core/testing';
import { RadioBrowserService } from './radio-browser.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('RadioBrowserService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      HttpClientTestingModule
    ]
  }));

  it('should be created', () => {
    const service: RadioBrowserService = TestBed.get(RadioBrowserService);
    expect(service).toBeTruthy();
  });
});
