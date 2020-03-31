import { Type } from '@angular/core';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { StreamInfoService } from './stream-info.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ConfigService } from '@config';
import { createConfigServiceSpy } from '@config/testing';
import { OAuthService } from 'angular-oauth2-oidc';
import { createOAuthServiceSpy } from '@core/testing';
import { StreamInfo } from '../models/player/stream-info';

describe('StreamInfoService', () => {
  let metadataService: StreamInfoService;
  let configService: ConfigService;
  let httpTestingController: HttpTestingController;
  let getMetadataSpy: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        StreamInfoService,
        { provide: ConfigService, useValue: createConfigServiceSpy() },
        { provide: OAuthService, useValue: createOAuthServiceSpy() }
      ]
    });
    metadataService = TestBed.inject(StreamInfoService);
    configService = TestBed.inject(ConfigService);
    httpTestingController = TestBed.inject(HttpTestingController as Type<HttpTestingController>);
    getMetadataSpy = jasmine.createSpyObj('getMetadata', ['emit', 'error', 'complete']);
  });

  const testEntries: Array<{rawResponse: object, expectedMapping: StreamInfo }> = [
    {
      rawResponse: {
        'title': 'HammerFall - Life Is Now',
        'fetchsource': 'STREAM',
        'headers': {
          'icy-notice1': '<BR>This stream requires <a href="http',
          'icy-notice2': 'SHOUTcast Distributed Network Audio Server/win32 v1.9.8<BR>',
          'icy-name': 'Radio Caprice - Power Metal',
          'icy-genre': 'See Stream Title',
          'icy-url': 'http',
          'content-type': 'audio/aacp',
          'icy-pub': '1',
          'icy-metaint': '8192',
          'icy-br': '48'
        }
      },
      expectedMapping: new StreamInfo('HammerFall - Life Is Now', 'STREAM', '48', 'Radio Caprice - Power Metal', null, 'See Stream Title')
    },
    {
      rawResponse: {
        'title': 'Pavarotti: 50 Greatest Tracks - Pavarotti: 50 Greatest Tracks',
        'fetchsource': 'STREAM',
        'headers': {
          'content-type': 'audio/mpeg',
          'icy-br': '128',
          'icy-description': 'WQXR',
          'icy-genre': 'Various',
          'icy-name': 'WQXR',
          'icy-pub': '0',
          'icy-url': 'http',
          'access-control-allow-headers': 'Origin, Accept, X-Requested-With, Content-Type',
          'icy-metaint': '16000'
        }},
      expectedMapping: new StreamInfo(
        'Pavarotti: 50 Greatest Tracks - Pavarotti: 50 Greatest Tracks', 'STREAM', '128', 'WQXR', 'WQXR', 'Various'
        )
    },
    {
      rawResponse: {
        'listeners': '9',
        'bitrate': '48',
        'title': 'Angra - Perfect Symmetry',
        'fetchsource': 'SHOUTCAST_V1'
      },
      expectedMapping: new StreamInfo('Angra - Perfect Symmetry', 'SHOUTCAST_V1', '48')
    }
  ];

  it('should be created', () => {
    expect(metadataService).toBeTruthy();
  });

  it('should properly map API responses to the Metadata model', () => {
    let iteration = 0;

    // For each test entry
    testEntries.forEach(testEntry => {
      /* Spy on the subscription so that we know exactly what it emits.
      We're passing iteration as the URL because we want to use a new URL
      for each request to ensure that we're not adding the STREAM param to
      the request URL.  This test is for mapping, we'll test the stream type
      caching in its own test. */
      metadataService.getMetadata(iteration.toString()).subscribe(
        emit => getMetadataSpy.emit(emit),
        error => getMetadataSpy.error(error),
        () => getMetadataSpy.complete()
      );
      // Ensure that it hasn't emitted any new values yet
      expect(getMetadataSpy.emit).toHaveBeenCalledTimes(iteration);
      // Set up a test HTTP request at the expected URL and flush the specified response
      const metaDataRequest = httpTestingController.expectOne(`${configService.appConfig.metadataApiUrl}/now-playing?url=${iteration}`);
      metaDataRequest.flush(testEntry.rawResponse);
      // Ensure that the subscription emitted one new value which matches the provided expecting mapping
      expect(getMetadataSpy.emit).toHaveBeenCalledTimes(iteration + 1);
      expect(getMetadataSpy.emit.calls.mostRecent().args).toEqual([testEntry.expectedMapping]);
      iteration++;
    });

    httpTestingController.verify();
    expect(getMetadataSpy.emit).toHaveBeenCalledTimes(testEntries.length);
    expect(getMetadataSpy.complete).toHaveBeenCalledTimes(testEntries.length);
    expect(getMetadataSpy.error).not.toHaveBeenCalled();
  });

  it('should store the returned stream type for subsequent requests for the same URL', () => {
    /* Request 10 different stations twice.  The first request should specify only URL, but the second
    request should also specify the 'method' that was returned as 'fetchsource' from the previous request. */
    for (let i = 0; i < 10; i++) {
      // Make the first request to the specified station
      metadataService.getMetadata(i.toString()).subscribe(
        emit => getMetadataSpy.emit(emit),
        error => getMetadataSpy.error(error),
        () => getMetadataSpy.complete()
      );
      /* Expect an request at the API URL for the specified station URL without the method querystring parameter.
      Flush a dummy response which contains a unique fetch source based on the dummy station url. */
      const dummyFetchSource = `${i}_fetchsource`;
      const firstRequest = httpTestingController.expectOne(`${configService.appConfig.metadataApiUrl}/now-playing?url=${i}`);
      firstRequest.flush({fetchsource: dummyFetchSource});
      // Make a subsequent request to the same station
      metadataService.getMetadata(i.toString()).subscribe(
        emit => getMetadataSpy.emit(emit),
        error => getMetadataSpy.error(error),
        () => getMetadataSpy.complete()
      );
      /* We expect that the subsequent requested URL will be similar to the first, but with the dummy fetch source
      appended to the querystring. */
      const subsequentRequest = httpTestingController.expectOne(
        `${configService.appConfig.metadataApiUrl}/now-playing?url=${i}&method=${dummyFetchSource}`
        );
      subsequentRequest.flush({fetchsource: dummyFetchSource});
    }
    expect(getMetadataSpy.emit).toHaveBeenCalledTimes(20);
    expect(getMetadataSpy.complete).toHaveBeenCalledTimes(20);
    expect(getMetadataSpy.error).not.toHaveBeenCalled();
    // Ensure that there are no outstanding requests
    httpTestingController.verify();
  });

  it('should time out when the request takes too long', fakeAsync(() => {
    metadataService.getMetadata('test').subscribe(
      emit => getMetadataSpy.emit(emit),
      error => getMetadataSpy.error(error),
      () => getMetadataSpy.complete()
    );

    // 1 ms before timeout, the subscription should still be waiting
    tick(configService.appConfig.metadataFetchTimeout - 1);
    expect(getMetadataSpy.error).not.toHaveBeenCalled();
    // Upon timeout the observable should emit an error
    tick(1);
    expect(getMetadataSpy.error).toHaveBeenCalledTimes(1);

    // The observable should not emit or complete at all
    expect(getMetadataSpy.emit).not.toHaveBeenCalled();
    expect(getMetadataSpy.complete).not.toHaveBeenCalled();
  }));
});
