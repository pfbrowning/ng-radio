import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { MatIconModule } from '@angular/material/icon';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { provideMockStore } from '@ngrx/store/testing';
import { initialRootState } from '@core';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async(() => {

    TestBed.configureTestingModule({
      imports: [
        MatIconModule,
        ToastModule
      ],
      declarations: [
        AppComponent
      ],
      providers: [
        provideMockStore({initialState: initialRootState}),
        MessageService
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
