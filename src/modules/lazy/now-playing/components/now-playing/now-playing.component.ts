import { Component, ChangeDetectorRef, OnInit, OnDestroy } from '@angular/core';
import { KeepAwakeService } from '@modules/core/keep-awake/keep-awake.module';
import { SleepTimerService, StreamInfoStatus, PlayerService } from '@modules/core/core-radio-logic/core-radio-logic.module';
import { Subscription, merge, timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { setAltSrc } from '@utilities';
import { Store, select } from '@ngrx/store';
import { RootState } from '@root-state';
import {
  addCurrentStationToFavoritesRequested,
  removeCurrentStationFromFavoritesRequested, 
  selectIsProcessingFavoritesForCurrentStation,
  selectIsCurrentStationInFavorites,
  selectCurrentStationFavoritesProcessingState,
  CurrentStationFavoritesProcessingState
} from '@root-state/favorite-stations';

@Component({
  templateUrl: './now-playing.component.html',
  styleUrls: ['./now-playing.component.scss']
})
export class NowPlayingComponent implements OnInit, OnDestroy {
  constructor(public playerService: PlayerService,
    public sleepTimerService: SleepTimerService,
    public keepAwakeService: KeepAwakeService,
    private changeDetectorRef: ChangeDetectorRef,
    private store: Store<RootState>
  ) {}

  public streamInfoStatus = StreamInfoStatus;
  private changeDetectionSubscription: Subscription;
  public processingFavorites$ = this.store.pipe(select(selectIsProcessingFavoritesForCurrentStation));
  public favoritesProcessingState$ = this.store.pipe(select(selectCurrentStationFavoritesProcessingState));
  public isCurrentStationInFavorites$ = this.store.pipe(select(selectIsCurrentStationInFavorites));

  public ngOnInit() {
    // When the play / pause state or the now playing info canged
    this.changeDetectionSubscription = merge(
      this.playerService.nowPlaying$,
      this.playerService.paused$
    )
    /* Wait 0ms for the async pipe bindings to catch up.
    Use timer in place of delay because of
    https://github.com/angular/angular/issues/10127 */
    .pipe(switchMap(() => timer(0)))
    .subscribe(() => this.changeDetectorRef.detectChanges());
  }

  ngOnDestroy() {
    if (this.changeDetectionSubscription) { this.changeDetectionSubscription.unsubscribe(); }
  }

  public onImgError(img: HTMLImageElement, altSrc: string) {
    setAltSrc(img, altSrc);
  }

  public onTimerSelected(length: number) {
    if (length != null) {
      this.sleepTimerService.setTimer(length);
    } else {
      this.sleepTimerService.cancelTimer();
    }
  }

  public onAddToFavoritesClicked(): void {
    this.store.dispatch(addCurrentStationToFavoritesRequested());
  }

  public onRemoveFromFavoritesClicked(): void {
    this.store.dispatch(removeCurrentStationFromFavoritesRequested());    
  }

  public decideFavoritesProcessingButtonText(state: CurrentStationFavoritesProcessingState) {
    switch(state) {
      case CurrentStationFavoritesProcessingState.Fetching:
        return "Loading...";
      case CurrentStationFavoritesProcessingState.Adding:
        return "Adding...";
      case CurrentStationFavoritesProcessingState.Removing:
        return "Removing...";
      default:
        return null;
    }
  }
}
