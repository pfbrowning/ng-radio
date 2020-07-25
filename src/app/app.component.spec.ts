import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { MatIconModule } from '@angular/material/icon';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { provideMockStore } from '@ngrx/store/testing';
import { initialRootState } from '@core';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { GlobalSpinnerStubComponent, ToasterContainerStubComponent } from '@root-components/testing';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async(() => {

    TestBed.configureTestingModule({
      imports: [
        MatIconModule,
        ToastModule,
        ConfirmDialogModule
      ],
      declarations: [
        AppComponent,
        GlobalSpinnerStubComponent,
        ToasterContainerStubComponent
      ],
      providers: [
        provideMockStore({initialState: initialRootState}),
        MessageService,
        ConfirmationService
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });

  it('should create the app', () => {
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });
});
