import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { Station } from '@modules/core/core-radio-logic/core-radio-logic.module';
import { FavoriteStationsService } from '@modules/core/core-radio-logic/services/favorite-stations.service';

@Injectable({providedIn: 'root'})
export class FavoriteStationsResolver implements Resolve<Array<Station>> {
  constructor(private favoriteStationsService: FavoriteStationsService) {}
  resolve(): Observable<Array<Station>> {
    return this.favoriteStationsService.fetchAll()
  }
}
