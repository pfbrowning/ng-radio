import { TestBed } from '@angular/core/testing';
import { RadioBrowserService } from './radio-browser.service';
import {
    HttpClientTestingModule,
    HttpTestingController,
} from '@angular/common/http/testing';
import { HttpParams } from '@angular/common/http';
import { ConfigService } from '../config/config.service';
import { Station } from '../../models/player/station';
import isFalsyOrWhitespace from 'is-falsy-or-whitespace';
import { ConfigStubService } from '@core/testing';

describe('RadioBrowserService', () => {
    let radioBrowserService: RadioBrowserService;
    let httpTestingController: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                RadioBrowserService,
                { provide: ConfigService, useClass: ConfigStubService },
            ],
        });

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
            tag: 'test tag',
        },
        {
            name: null,
            country: null,
            tag: 'tag 2',
        },
        {
            name: '',
            country: 'some other country',
            tag: 'tag 3',
        },
        {
            name: 'name 2',
            tag: null,
        },
        {
            name: 'name 3',
            tag: '',
        },
    ];
    shouldFormRequestsInput.forEach(({name, tag, country}) => it('should properly form requests', (done: DoneFn) => {        
            // Arrange
            const checkBodyParam = (
                paramKey: string,
                paramValue: string,
                body: HttpParams
            ) => {
                if (!isFalsyOrWhitespace(paramValue)) {
                    expect(body.get(paramKey)).toBe(paramValue);
                } else {
                    expect(body.get(paramKey)).toBeNull();
                }
            };

            // Act
            radioBrowserService
                .search(name, country, tag)
                .subscribe(response => {
                    // Assert
                    checkBodyParam('name', name, request.request.body);
                    checkBodyParam(
                        'countrycode',
                        country,
                        request.request.body
                    );
                    checkBodyParam('tag', tag, request.request.body);
                    // Limit should be 25 regardless of what was passed in
                    checkBodyParam('limit', '25', request.request.body);

                    done();
                });

            const request = httpTestingController.expectOne(
                `test.com/stations/search`
            );
            expect(request.request.method).toBe('POST');

            // Flush a dummy response
            request.flush([
                {
                    id: 'test',
                    name: 'name',
                    url: 'someplace.com',
                    homepage: 'somewhereelse.com',
                    favicon: 'icon.com',
                    tags: null,
                    country: 'US',
                    language: 'English',
                    bitrate: '48',
                },
            ]);
    }));

    const shouldMapResponsesInput = [
        {
            response: {
                id: 'test',
                name: 'name',
                url: 'someplace.com',
                homepage: 'somewhereelse.com',
                favicon: 'icon.com',
                tags: null,
                country: 'US',
                language: 'English',
                bitrate: '48',
            },
            expected: new Station(
                null,
                'name',
                'someplace.com',
                null,
                'icon.com'
            ),
        },
        {
            response: {
                id: 'id 2',
                name: 'name 2',
                url: 'url 2',
                homepage: 'homepage 2',
                favicon: 'favicon 2',
                tags: 'tag1,tag2,tag3',
                country: 'US',
                language: 'English',
                bitrate: '48',
            },
            expected: new Station(null, 'name 2', 'url 2', null, 'favicon 2', [
                'tag1',
                'tag2',
                'tag3',
            ]),
        },
        {
            response: {
                id: 'id 3',
                name: 'name 3',
                url: 'url 3',
                homepage: 'homepage 3',
                favicon: 'favicon 3',
                tags: '',
                country: 'US',
                language: 'English',
                bitrate: '48',
            },
            expected: new Station(null, 'name 3', 'url 3', null, 'favicon 3'),
        },
    ];
    shouldMapResponsesInput.forEach(({response, expected}) => it('should properly map responses', (done: DoneFn) => {
            // Act: Initiate a dummy request.  We don't care about what's passed in or how the request is formed.
            radioBrowserService
                .search('name', 'country', 'tag')
                .subscribe(stations => {
                    // Assert
                    // The expected test entry should have been returned
                    expect(stations.length).toBe(1);
                    expect(stations[0]).toEqual(expected);

                    done();
                });

            // Expect and flush the test response from the http testing controller
            const request = httpTestingController.expectOne(
                `test.com/stations/search`
            );
            request.flush([response]);

    }))
});
