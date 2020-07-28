import { TestBed } from '@angular/core/testing';
import { RadioBrowserService } from './radio-browser.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpParams } from '@angular/common/http';
import { ConfigService } from './config.service';
import { createConfigServiceSpy } from '../testing/core-spy-factories.spec';
import { Station } from '../models/player/station';
import { isFalsyOrWhitespace } from '@utilities';
import theoretically from 'jasmine-theories';

describe('RadioBrowserService', () => {
  let radioBrowserService: RadioBrowserService;
  let configService: ConfigService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        RadioBrowserService,
        { provide: ConfigService, useValue: createConfigServiceSpy() }
      ]
    });

    configService = TestBed.inject(ConfigService);
    radioBrowserService = TestBed.inject(RadioBrowserService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(radioBrowserService).toBeTruthy();
  });

  const shouldFormRequestsInput = [
    {
      name: 'test name',
      country: 'US',
      tag: 'test tag'
    },
    {
      name: null,
      country: null,
      tag: 'tag 2'
    },
    {
      name: '',
      country: 'some other country',
      tag: 'tag 3'
    },
    {
      name: 'name 2',
      'tag': null
    },
    {
      name: 'name 3',
      tag: ''
    }
  ];
  theoretically.it('should properly form requests', shouldFormRequestsInput, (input, done: DoneFn) => {
    // Arrange
    const checkBodyParam = (paramKey: string, paramValue: string, body: HttpParams) => {
      if (!isFalsyOrWhitespace(paramValue)) {
        expect(body.get(paramKey)).toBe(paramValue);
      } else {
        expect(body.get(paramKey)).toBeNull();
      }
    };

    // Act
    radioBrowserService.search(input.name, input.country, input.tag).subscribe(response => {
      // Assert
      checkBodyParam('name', input.name, request.request.body);
      checkBodyParam('countrycode', input.country, request.request.body);
      checkBodyParam('tag', input.tag, request.request.body);
      // Limit should be 25 regardless of what was passed in
      checkBodyParam('limit', '25', request.request.body);

      done();
    });


    const request = httpTestingController.expectOne(`${configService.appConfig.radioBrowserApiUrl}/stations/search`);
    expect(request.request.method).toBe('POST');

    // Flush a dummy response
    request.flush([{
      'id': 'test',
      'name': 'name',
      'url': 'someplace.com',
      'homepage': 'somewhereelse.com',
      'favicon': 'icon.com',
      'tags': null,
      'country': 'US',
      'language': 'English',
      'bitrate': '48'
    }]);
  });


  const shouldMapResponsesInput = [
    {
      response: {
        'id': 'test',
        'name': 'name',
        'url': 'someplace.com',
        'homepage': 'somewhereelse.com',
        'favicon': 'icon.com',
        'tags': null,
        'country': 'US',
        'language': 'English',
        'bitrate': '48'
      },
      expected: new Station(null, 'name', 'someplace.com', null, 'icon.com')
    },
    {
      response: {
        'id': 'id 2',
        'name': 'name 2',
        'url': 'url 2',
        'homepage': 'homepage 2',
        'favicon': 'favicon 2',
        'tags': 'tag1,tag2,tag3',
        'country': 'US',
        'language': 'English',
        'bitrate': '48'
      },
      expected: new Station(null, 'name 2', 'url 2', null, 'favicon 2', ['tag1', 'tag2', 'tag3'])
    },
    {
      response: {
        'id': 'id 3',
        'name': 'name 3',
        'url': 'url 3',
        'homepage': 'homepage 3',
        'favicon': 'favicon 3',
        'tags': '',
        'country': 'US',
        'language': 'English',
        'bitrate': '48'
      },
      expected: new Station(null, 'name 3', 'url 3', null, 'favicon 3')
    }
  ];
  theoretically.it('should properly map responses', shouldMapResponsesInput, (input, done: DoneFn) => {
    // Act: Initiate a dummy request.  We don't care about what's passed in or how the request is formed.
    radioBrowserService.search('name', 'country', 'tag').subscribe(stations => {
      // Assert
      // The expected test entry should have been returned
      expect(stations.length).toBe(1);
      expect(stations[0]).toEqual(input.expected);

      done();
    });

    // Expect and flush the test response from the http testing controller
    const request = httpTestingController.expectOne(`${configService.appConfig.radioBrowserApiUrl}/stations/search`);
    request.flush([input.response]);
  });
});
