import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ToasterContainerComponent } from './toaster-container.component';
import { MessageService } from 'primeng/api';
import { createMessageServiceSpy } from '@core/testing';

describe('ToasterContainerComponent', () => {
  let component: ToasterContainerComponent;
  let fixture: ComponentFixture<ToasterContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ToasterContainerComponent ],
      providers: [
        { provide: MessageService, useValue: createMessageServiceSpy() }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToasterContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
