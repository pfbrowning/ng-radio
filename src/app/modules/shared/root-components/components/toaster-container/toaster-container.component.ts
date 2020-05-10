import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy, AfterViewInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { SubSink } from 'subsink';
import { Store } from '@ngrx/store';
import { RootState } from '@core';
import { ApplicationActions } from '@core/store';

@Component({
  selector: 'blr-toaster-container',
  templateUrl: './toaster-container.component.html',
  styleUrls: ['./toaster-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToasterContainerComponent implements OnInit, OnDestroy, AfterViewInit {
  constructor(
    private messageService: MessageService,
    private changeDetectorRef: ChangeDetectorRef,
    private store: Store<RootState>
  ) { }

  private subs = new SubSink();

  public ngOnInit(): void {
    this.subs.sink = this.messageService.messageObserver.subscribe(() => {
      this.changeDetectorRef.markForCheck();
    });
  }

  public ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  public ngAfterViewInit(): void {
    this.store.dispatch(ApplicationActions.toasterInitialized());
  }
}
