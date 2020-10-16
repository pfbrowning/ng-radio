import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Station } from '@core/models/player';

@Injectable({ providedIn: 'root' })
export class SuggestedStationsService {
    constructor(private httpClient: HttpClient) {}

    /** Retrieves the 'Developer-Suggested' stations from the JSON file stored in 'assets' */
    public fetchDeveloperSuggestions(): Observable<Station[]> {
        return this.httpClient.get<Station[]>(
            '/assets/data/suggested-stations.json'
        );
    }
}
