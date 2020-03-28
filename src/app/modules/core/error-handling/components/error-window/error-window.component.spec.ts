import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ErrorWindowComponent } from './error-window.component';
import { ModalManagerModule, ModalWindowComponent } from '@browninglogic/ng-modal';
import { ErrorHandlingService } from '../../services/error-handling.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { getElementBySelector, getElementTextBySelector } from '@test-helpers';
import { LoggingSpyFactories } from '@logging/testing';
import { LoggingService } from '@logging';

describe('ErrorWindowComponent', () => {
  let component: ErrorWindowComponent;
  let fixture: ComponentFixture<ErrorWindowComponent>;
  let errorHandlingService: ErrorHandlingService;
  let errorModal: ModalWindowComponent;
  let showModalSpy: jasmine.Spy;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ErrorWindowComponent ],
      imports: [
        ModalManagerModule,
        MatIconModule,
        MatButtonModule
      ],
      providers: [
        ErrorHandlingService,
        { provide: LoggingService, useValue: LoggingSpyFactories.CreateLoggingServiceSpy() }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorWindowComponent);
    errorHandlingService = fixture.debugElement.injector.get(ErrorHandlingService);
    component = fixture.componentInstance;
    errorModal = component.errorModal;
    showModalSpy = spyOn(errorModal, 'show').and.callThrough();
    fixture.detectChanges();
  });

  it('should not show anything on init', () => {
    expect(component).toBeTruthy();
    expect(component.appError).toBeUndefined();
    expect(showModalSpy).not.toHaveBeenCalled();
  });

  it('should show modal on error and bind messages to template', () => {
    /* Expect that upon initialization the modal is not visible and that
    no error message has been bound to the template. */
    expect(errorModal.visible).toBe(false);
    expect(getElementBySelector<ErrorWindowComponent>(fixture, '.error-message')).toBeNull();

    simulateCheckError('Test Error', 'Test Comment');
  });

  it('should continue to update the template for subsequent errors', () => {
    const errorSequence = [
      {'message': 'first error', 'comment': 'uh-oh'},
      {'message': 'second error', 'comment': 'oh no'},
      {'message': 'third error', 'comment': 'lots of errors!'}
    ];

    errorSequence.forEach(errorParam => simulateCheckError(errorParam.message, errorParam.comment));
  });

  function simulateCheckError(errorMessage: string, errorComment: string) {
    // Simulate the occurrence of an error
    errorHandlingService.handleError(new Error(errorMessage), errorComment);
    fixture.detectChanges();

    /* Expect that the modal is visible and the message and comment have been assigned
    to the appError model and bound to the template. */
    expect(errorModal.visible).toBe(true);
    expect(component.appError.error['message']).toBe(errorMessage);
    expect(component.appError.comment).toBe(errorComment);
    expect(getElementTextBySelector<ErrorWindowComponent>(fixture, '.error-message')).toBe(errorMessage);
    expect(getElementTextBySelector<ErrorWindowComponent>(fixture, '.error-comment')).toBe(errorComment);
  }
});
