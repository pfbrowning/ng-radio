import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { RootState } from '@core';
import { selectIsStationSelected } from '@core/store/player';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'blr-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {
  constructor(private store: Store<RootState>, private httpClient: HttpClient) {}

  public stationSelected$ = this.store.pipe(select(selectIsStationSelected));

  public ngOnInit(): void {
    this.httpClient.get('https://thingproxy.freeboard.io/fetch/http://79.111.119.111:9107/7.html',
    {responseType:'text'})
    .subscribe({
      next: next => console.log('fetched',  next),
      error: error => console.log('error', error)
    });
  }
}
