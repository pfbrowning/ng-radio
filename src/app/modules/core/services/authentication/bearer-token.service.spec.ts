import { TestBed } from '@angular/core/testing'
import { BearerTokenService } from './bearer-token.service'
import { ConfigService } from '../config/config.service'
import { CoreSpyFactories } from '@core/testing'
import { of, NEVER } from 'rxjs'
import {
    HttpClientTestingModule,
    HttpTestingController,
} from '@angular/common/http/testing'
import { HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http'
import { ConfigStubService } from '../../testing/stubs/config-stub-service.spec'
import { AuthenticationFacadeService } from '../../store/authentication/authentication-facade.service'

describe('BearerTokenService', () => {
    let bearerTokenService: BearerTokenService
    let configService: ConfigStubService
    let authenticationFacade: jasmine.SpyObj<AuthenticationFacadeService>
    let httpClient: HttpClient
    let httpTestingController: HttpTestingController
    const config: any = Object.freeze({
        favoriteStationsApiUrl: 'mockFavoritesUrl',
        radioProxyUrl: 'mockRadioProxyUrl',
    })

    beforeEach(() => {
        authenticationFacade = CoreSpyFactories.createAuthenticationFacadeSpy()
        configService = new ConfigStubService()

        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                BearerTokenService,
                { provide: ConfigService, useValue: configService },
                {
                    provide: AuthenticationFacadeService,
                    useValue: authenticationFacade,
                },
                {
                    provide: HTTP_INTERCEPTORS,
                    useClass: BearerTokenService,
                    multi: true,
                },
            ],
        })

        bearerTokenService = TestBed.inject(BearerTokenService)
        authenticationFacade = TestBed.inject(
            AuthenticationFacadeService
        ) as any
        httpClient = TestBed.inject(HttpClient)
        httpTestingController = TestBed.inject(HttpTestingController)

        configService.appConfig$ = of(config)
    })

    it('should be created', () => {
        expect(bearerTokenService).toBeTruthy()
    })

    const shouldAddTokenCases = [
        'mockFavoritesUrl',
        'mockFavoritesUrl/somePath',
        'mockRadioProxyUrl',
        'mockRadioProxyUrl/somePath',
    ]
    shouldAddTokenCases.forEach((url) => {
        it(`should add a bearer token if the request is for an API url specified in the config: ${url}`, (done: DoneFn) => {
            // Arrange
            const expectedHeader = 'Bearer mockAccessToken'
            authenticationFacade.accessToken$ = of('mockAccessToken')

            // Act
            httpClient.get(url).subscribe(() => {
                // Assert
                httpTestingController.verify()

                done()
            })

            // Assert
            const request = httpTestingController.expectOne(
                (req) => req.headers.get('Authorization') === expectedHeader
            )
            request.flush({ data: 'test' })

            expect(request.request.headers.get('Authorization')).toBe(
                expectedHeader
            )
        })
    })

    const shouldNotAddTokenCases = [
        {
            requestedUrl: 'somePathThatDoesntStartWithAConfiguredApiPath',
            accessToken: 'mockToken',
        },
        { requestedUrl: 'mockFavoritesUrl/somePath', accessToken: '   ' },
    ]
    shouldNotAddTokenCases.forEach((input) => {
        it(`should not add a token: ${JSON.stringify(
            input
        )}`, (done: DoneFn) => {
            // Arrange
            authenticationFacade.accessToken$ = of(input.accessToken)

            // Act
            httpClient.get(input.requestedUrl).subscribe(() => {
                // Assert
                httpTestingController.verify()

                done()
            })

            // Assert
            const request = httpTestingController.expectOne(
                (req) => !req.headers.has('Authorization')
            )
            request.flush({ data: 'test' })

            expect(request.request.headers.has('Authorization')).toBeFalse()
        })
    })

    const shouldShortCircuitConfigFetchCases = [
        '/assets/config/app.config.json',
        '/assets/config/local.config.json',
    ]
    shouldShortCircuitConfigFetchCases.forEach((requestedUrl) => {
        it(`should short-circuit config fetch: ${requestedUrl}`, (done: DoneFn) => {
            // Arrange
            configService.appConfig$ = NEVER

            // Act
            httpClient.get(requestedUrl).subscribe(() => {
                // Assert
                httpTestingController.verify()

                done()
            })

            // Assert
            const request = httpTestingController.expectOne(
                (req) => !req.headers.has('Authorization')
            )
            request.flush({ data: 'test' })

            expect(request.request.headers.has('Authorization')).toBeFalse()
        })
    })
})
