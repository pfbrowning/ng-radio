import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CustomStationComponent } from './custom-station.component';
import { MatFormFieldModule, MatInputModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
import { PlayerService } from '@modules/core/core-radio-logic/core-radio-logic.module';
import { CoreRadioLogicSpyFactories } from '@modules/core/core-radio-logic/testing/core-radio-logic-spy-factories.spec';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('CustomStationComponent', () => {
  let component: CustomStationComponent;
  let fixture: ComponentFixture<CustomStationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        RouterTestingModule,
        NoopAnimationsModule,
        MatFormFieldModule,
        MatInputModule
      ],
      declarations: [ CustomStationComponent ],
      providers: [
        { provide: PlayerService, useValue: CoreRadioLogicSpyFactories.CreatePlayerServiceSpy() },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomStationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
