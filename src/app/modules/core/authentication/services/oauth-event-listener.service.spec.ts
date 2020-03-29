import { TestBed } from '@angular/core/testing';
import { OauthEventListenerService } from './oauth-event-listener.service';

describe('OauthEventListenerService', () => {
  let service: OauthEventListenerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OauthEventListenerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
