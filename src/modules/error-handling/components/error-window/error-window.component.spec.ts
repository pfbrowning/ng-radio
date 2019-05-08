import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ErrorWindowComponent } from './error-window.component';
import { ModalManagerModule } from '@browninglogic/ng-modal';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ErrorHandlingService } from '../../services/error-handling.service';
import { ErrorHandlingSpyFactories } from '../../testing/error-handling-spy-factories.spec';

describe('ErrorWindowComponent', () => {
  let component: ErrorWindowComponent;
  let fixture: ComponentFixture<ErrorWindowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ErrorWindowComponent ],
      imports: [
        ModalManagerModule,
        MatIconModule,
        MatButtonModule
      ],
      providers: [
        { provide: ErrorHandlingService, useValue: ErrorHandlingSpyFactories.CreateErrorHandlingServiceSpy() },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
