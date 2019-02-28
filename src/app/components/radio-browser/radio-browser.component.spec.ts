import { async, ComponentFixture, TestBed } from '@angular/core/testing'; import { RadioBrowserComponent } from './radio-browser.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { SpyFactories } from 'src/app/testing/spy-factories.spec';
import { RadioBrowserService } from 'src/app/services/radio-browser.service';
import { PlayerService } from 'src/app/services/player.service';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('RadioBrowserComponent', () => {
  let component: RadioBrowserComponent;
  let fixture: ComponentFixture<RadioBrowserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RadioBrowserComponent ],
      imports: [
        MatFormFieldModule,
        MatTableModule,
        MatFormFieldModule,
        MatInputModule,
        FormsModule,
        NoopAnimationsModule
      ],
      providers: [
        { provide: PlayerService, useValue: SpyFactories.CreatePlayerServiceSpy() },
        { provide: RadioBrowserService, useValue: SpyFactories.CreateRadioBrowserServiceSpy() }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RadioBrowserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
