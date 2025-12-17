import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnDestroy,
  AfterViewInit,
} from '@angular/core';
import { MessageService } from 'primeng/api';
import { SubSink } from 'subsink';
import { ToasterReadyService } from '@core/services';

@Component({
  selector: 'blr-toaster-container',
  templateUrl: './toaster-container.component.html',
  styleUrls: ['./toaster-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class ToasterContainerComponent implements OnInit, OnDestroy, AfterViewInit {
  constructor(
    private messageService: MessageService,
    private changeDetectorRef: ChangeDetectorRef,
    private toasterReadyService: ToasterReadyService
  ) {}

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
    this.toasterReadyService.toasterInitialized();
  }
}
