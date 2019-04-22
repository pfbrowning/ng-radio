import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CustomStationWindowComponent } from './custom-station-window.component';
import { ModalManagerModule } from '@browninglogic/ng-modal';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { PlayerService } from 'src/app/services/player.service';
import { SpyFactories } from 'src/app/testing/spy-factories.spec';
import { MatInputModule } from '@angular/material/input';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('CustomStationWindowComponent', () => {
  let component: CustomStationWindowComponent;
  let fixture: ComponentFixture<CustomStationWindowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ModalManagerModule,
        MatFormFieldModule,
        MatInputModule,
        NoopAnimationsModule
      ],
      declarations: [ CustomStationWindowComponent ],
      providers: [
        { provide: PlayerService, useValue: SpyFactories.CreatePlayerServiceSpy() }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomStationWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
