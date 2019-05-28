import { TestBed } from '@angular/core/testing';
import { StationLookupService } from './station-lookup.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ConfigService } from '@modules/core/config/config.module';
import { createConfigServiceSpy } from '@modules/core/config/testing/config-spy-factories.spec';
import { HttpParams } from '@angular/common/http';
import { Station } from '../models/station';
import { CoreRadioLogicModule } from '../core-radio-logic.module';
import isBlank from 'is-blank';

describe('RadioBrowserService', () => {
  let configService: ConfigService;
  let httpTestingController: HttpTestingController;
  let stationLookupService: StationLookupService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        CoreRadioLogicModule
      ],
      providers: [
        { provide: ConfigService, useValue: createConfigServiceSpy() }
      ]
    });

    configService = TestBed.get(ConfigService);
    stationLookupService = TestBed.get(StationLookupService);
    httpTestingController = TestBed.get(HttpTestingController);
  });

  it('should be created', () => {
    expect(stationLookupService).toBeTruthy();
  });

  it('should properly form requests', () => {
    // Arrange
    const testEntries = [
      { 'name': 'test name', 'tag': 'test tag' },
      { 'name': null, 'tag': 'tag 2' },
      { 'name': '', 'tag': 'tag 3' },
      { 'name': 'name 2', 'tag': null },
      { 'name': 'name 3', 'tag': '' }
    ];

    /* We want to check the body params in the same way so we'll just wrap that logic
    into a function because DRY */
    const checkBodyParam = function(paramKey: string, paramValue: string, body: HttpParams) {
      if (!isBlank(paramValue)) {
        expect(body.get(paramKey)).toBe(paramValue);
      } else {
        expect(body.get(paramKey)).toBeNull();
      }
    };

    // For each test entry
    testEntries.forEach(testEntry => {
      // Act: Initiate a station search operation based on the test name & tag
      stationLookupService.search(testEntry.name, testEntry.tag).subscribe();
      // Assert: Set up expectations for what we expect the generated HTTP request to look like
      const request = httpTestingController.expectOne(`${configService.appConfig.radioBrowserApiUrl}/stations/search`);
      expect(request.request.method).toBe('POST');
      // Name & tag should be present on the request body if non-blank values were provided
      checkBodyParam('name', testEntry.name, request.request.body);
      checkBodyParam('tag', testEntry.tag, request.request.body);
      // Limit should be 100 regardless of what was passed in
      checkBodyParam('limit', '100', request.request.body);

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
  });

  it('should properly map responses', () => {
    // Arrange: Set up a spy  and a few test entries
    const stationCheckedSpy = jasmine.createSpy('stationChecked');
    const testEntries = [
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
        expected: new Station('name', 'someplace.com', null, 'icon.com')
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
        expected: new Station('name 2', 'url 2', null, 'favicon 2', ['tag1', 'tag2', 'tag3'])
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
        expected: new Station('name 3', 'url 3', null, 'favicon 3')
      }
    ];

    // For each test entry
    testEntries.forEach(testEntry => {
      // Act: Initiate a dummy request.  We don't care about what's passed in or how the request is formed.
      stationLookupService.search('name', 'tag').subscribe(stations => {
        // Assert
        // The expected test entry should have been returned
        expect(stations.length).toBe(1);
        expect(stations[0]).toEqual(testEntry.expected);
        /* Call the stationCheckedSpy so that we can ensure that this callback
        was hit once for each test entry before the test ended. */
        stationCheckedSpy();
      });
      // Expect and flush the test response from the http testing controller
      const request = httpTestingController.expectOne(`${configService.appConfig.radioBrowserApiUrl}/stations/search`);
      request.flush([testEntry.response]);
    });
    /* We expect that stationCheckedSpy was called once per test entry so that we know
    that the test isn't completing before each subscribe callback has been processed. */
    expect(stationCheckedSpy).toHaveBeenCalledTimes(testEntries.length);
  });
});
