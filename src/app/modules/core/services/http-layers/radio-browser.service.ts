import { Injectable } from '@angular/core'
import { Observable, forkJoin } from 'rxjs'
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http'
import { map, switchMap } from 'rxjs/operators'
import { ConfigService } from '../config/config.service'
import { Station } from '../../models/player/station'
import { Country } from '../../models/country'
import { sortBy } from 'lodash-es'
import isFalsyOrWhitespace from 'is-falsy-or-whitespace'

@Injectable({ providedIn: 'root' })
export class RadioBrowserService {
    constructor(
        private configService: ConfigService,
        private httpClient: HttpClient
    ) {}

    private radioBrowserUrl$ = this.configService.appConfig$.pipe(
        map((config) => config.radioBrowserApiUrl)
    )

    private fetchAllCountries(): Observable<Country[]> {
        return this.httpClient
            .get<Country[]>('/assets/data/countries.json')
            .pipe(
                map((countries) =>
                    sortBy(countries, [(c) => c.code !== 'US', (c) => c.name])
                )
            )
    }

    private fetchListedCountryCodes(): Observable<string[]> {
        return this.radioBrowserUrl$.pipe(
            switchMap((url) =>
                this.httpClient.get<object[]>(`${url}/countrycodes`)
            ),
            map((response) => response.map((o) => o['name']))
        )
    }

    public fetchListedCountries(): Observable<Country[]> {
        return forkJoin([
            this.fetchAllCountries(),
            this.fetchListedCountryCodes(),
        ]).pipe(
            map(([countries, listed]) => {
                const lowercaseListed = listed.map((c) => c.toLowerCase())

                return countries.filter((country) =>
                    lowercaseListed.includes(country.code.toLowerCase())
                )
            })
        )
    }

    public fetchTags(filter: string = null): Observable<string[]> {
        let params = new HttpParams()
        params = params.append('order', 'stationcount')
        params = params.append('reverse', 'true')

        return this.radioBrowserUrl$.pipe(
            // All tags in the API appear to be lowercase
            map((url) =>
                !isFalsyOrWhitespace(filter)
                    ? `${url}/tags/${filter.toLowerCase()}`
                    : `${url}/tags`
            ),
            switchMap((url) => this.httpClient.get<object[]>(url, { params })),
            map((response) => response.map((o) => o['name']))
        )
    }

    /**
     * Searches the Radio Browser API for stations matching the provided criteria
     * @param name Station name / title to search for
     * @param countryCode Country code to search for
     * @param tag Station tag to search for
     * @param limit Max number of results to request from the radio browser API.  Defaults to 25.
     */
    public search(
        name: string = null,
        countryCode: string = null,
        tag: string = null,
        limit: number = 25
    ): Observable<Station[]> {
        let body = new HttpParams()
        if (!isFalsyOrWhitespace(name)) {
            body = body.set('name', name)
        }
        if (!isFalsyOrWhitespace(countryCode)) {
            body = body.set('countrycode', countryCode)
        }
        if (!isFalsyOrWhitespace(tag)) {
            body = body.set('tag', tag)
        }
        // Limit the results based on the provided param
        body = body.set('limit', limit.toString())
        body = body.set('order', 'votes')
        body = body.set('reverse', 'true')
        const headers = new HttpHeaders().set(
            'Content-Type',
            'application/x-www-form-urlencoded'
        )

        // Perform the search against the configured radioBrowserUrl
        return this.radioBrowserUrl$.pipe(
            switchMap((url) =>
                this.httpClient.post<any[]>(`${url}/stations/search`, body, {
                    headers,
                })
            ),
            // Map the results to our own station format
            map((stations) =>
                stations.map((station) => this.mapStation(station))
            )
        )
    }

    /**
     * Retrieves the 'Top Clicked' stations from the radio browser API
     * @param count Number of stations to request
     */
    public fetchTopClicked(count: number = 15): Observable<Station[]> {
        return this.radioBrowserUrl$.pipe(
            switchMap((url) =>
                this.httpClient.get<any[]>(`${url}/stations/topclick/${count}`)
            ),
            map((stations) =>
                stations.map((station) => this.mapStation(station))
            )
        )
    }

    /**
     * Retrieves the 'Top Voted' stations from the Radio Browser API
     * @param count Number of stations to request
     */
    public fetchTopVoted(count: number = 15): Observable<Station[]> {
        return this.radioBrowserUrl$.pipe(
            switchMap((url) =>
                this.httpClient.get<any[]>(`${url}/stations/topvote/${count}`)
            ),
            map((stations) =>
                stations.map((station) => this.mapStation(station))
            )
        )
    }

    /**
     * Maps the provided station result from Radio Browser API's station format
     * to our own Browninglogic Radio Station format.
     * @param station Station entry provided by the Radio Browser API
     */
    private mapStation(station: any) {
        // If a non-empty tags string was provided, then split it into an array by the comma delimiter
        const tags = !isFalsyOrWhitespace(station.tags)
            ? station.tags.split(',')
            : null
        return new Station(
            null,
            station.name,
            station.url,
            null,
            station.favicon,
            tags
        )
    }
}
