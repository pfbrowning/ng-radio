import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { MatIconModule } from '@angular/material/icon';
import { ToastModule } from 'primeng/toast';
import { ModalManagerModule } from '@browninglogic/ng-modal';
import { createErrorHandlingServiceSpy } from '@error-handling/testing';
import { ErrorHandlingService, ErrorWindowComponent } from '@error-handling';
import { MessageService } from 'primeng/api';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { initialRootState } from './modules/core/core/models/initial-root-state';
import { RootState } from './modules/core/core/models/root-state';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let store: MockStore<RootState>;

  beforeEach(async(() => {

    TestBed.configureTestingModule({
      imports: [
        MatIconModule,
        ModalManagerModule,
        ToastModule
      ],
      declarations: [
        AppComponent,
        ErrorWindowComponent
      ],
      providers: [
        { provide: ErrorHandlingService, useValue: createErrorHandlingServiceSpy() },
        provideMockStore({initialState: initialRootState}),
        MessageService
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
  });

  it('should create the app', () => {
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });
});
