import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ToasterContainerComponent } from './toaster-container.component';
import { MessageService } from 'primeng/api';
import { CoreSpyFactories } from '@core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { initialRootState } from '@core';
import { ToastModule } from 'primeng/toast';

describe('ToasterContainerComponent', () => {
  let component: ToasterContainerComponent;
  let fixture: ComponentFixture<ToasterContainerComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ToasterContainerComponent],
        imports: [ToastModule],
        providers: [
          {
            provide: MessageService,
            useValue: CoreSpyFactories.createMessageServiceSpy(),
          },
          provideMockStore({ initialState: initialRootState }),
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ToasterContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
