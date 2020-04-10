import { TestBed } from '@angular/core/testing';

import { AudioElementFactoryService } from './audio-element-factory.service';

describe('AudioElementFactoryService', () => {
  let service: AudioElementFactoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AudioElementFactoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
