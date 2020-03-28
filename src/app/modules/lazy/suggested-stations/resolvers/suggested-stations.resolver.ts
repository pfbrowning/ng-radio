import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { SuggestedStations } from '../models/suggested-stations';
import { StationLookupService } from '@core-radio-logic';

@Injectable()
export class SuggestedStationsResolver implements Resolve<SuggestedStations> {
  constructor(private stationLookupService: StationLookupService) {}
  resolve(): Observable<SuggestedStations> {
    return forkJoin([
      this.stationLookupService.getDeveloperSuggestions(),
      this.stationLookupService.getTopClicked(14),
      this.stationLookupService.getTopVoted(14)
    ]).pipe(
      map(stationArrays => new SuggestedStations(stationArrays[0], stationArrays[1], stationArrays[2]))
    );
  }
}
