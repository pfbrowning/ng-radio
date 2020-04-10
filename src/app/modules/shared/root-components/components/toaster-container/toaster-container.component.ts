import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { MessageService } from 'primeng/api';
import { SubSink } from 'subsink';

@Component({
  selector: 'blr-toaster-container',
  templateUrl: './toaster-container.component.html',
  styleUrls: ['./toaster-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToasterContainerComponent implements OnInit, OnDestroy {
  constructor(
    private messageService: MessageService,
    private changeDetectorRef: ChangeDetectorRef
  ) { }

  private subs = new SubSink();

  ngOnInit(): void {
    this.subs.sink = this.messageService.messageObserver.subscribe(() => {
      this.changeDetectorRef.markForCheck();
    })
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
