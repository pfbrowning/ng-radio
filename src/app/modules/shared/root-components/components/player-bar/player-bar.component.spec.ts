import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { PlayerBarComponent } from './player-bar.component';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { KeepAwakeService } from '@core';
import { FormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { getElementBySelector, getElementTextBySelector } from '@utilities/testing';
import { SharedModule } from '@shared';
import { Station } from '@core/models/player';
import { CoreSpyFactories } from '@core/testing';
import { MatProgressButtonsModule } from 'mat-progress-buttons';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { StationIconStubDirective } from '@shared/testing';
import { PlayerBarFacadeService } from '@core/store';
import { PlayerBarStationInfoStubComponent } from '../../testing/stubs/player-bar-station-info-stub.component.spec';
import { SleepTimerService } from '@core/services';
import { ChangeDetectionStrategy } from '@angular/core';


describe('PlayerBarComponent', () => {
  let component: PlayerBarComponent;
  let fixture: ComponentFixture<PlayerBarComponent>;
  let keepAwakeServiceSpy: any;

  beforeEach(async(() => {
    keepAwakeServiceSpy = CoreSpyFactories.createKeepAwakeServiceSpy();

    TestBed.configureTestingModule({
      declarations: [
        PlayerBarComponent,
        PlayerBarStationInfoStubComponent,
        StationIconStubDirective,
      ],
      imports: [
        RouterTestingModule,
        MatMenuModule,
        MatToolbarModule,
        MatButtonModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        MatTooltipModule,
        FormsModule,
        SharedModule,
        NoopAnimationsModule,
        MatProgressSpinnerModule,
        MatProgressButtonsModule.forRoot()
      ],
      providers: [
        { provide: KeepAwakeService, useValue: keepAwakeServiceSpy },
        { provide: PlayerBarFacadeService, useValue: CoreSpyFactories.createPlayerBarFacadeSpy() },
        { provide: SleepTimerService, useValue: CoreSpyFactories.createSleepTimerServiceSpy() },
      ]
    })
    .overrideComponent(PlayerBarComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default }
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerBarComponent);
    component = fixture.componentInstance;
    component.currentStation = new Station();
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should update the template to reflect changes in minutes until sleep', () => {
    for (let i = 300; i >= 0; i--) {
      // Act
      component.minutesToSleep = i;
      fixture.detectChanges();

      // Assert: Ensure that the new value was rendered properly in the template
      expect(getElementTextBySelector<PlayerBarComponent>(fixture, '.minutes-until-sleep')).toBe(i.toString());
    }

    /* Clear the sleep timer and ensure that 'minutes until sleep'
    no longer shows a number. */
    component.minutesToSleep = null;
    fixture.detectChanges();
    expect(getElementTextBySelector<PlayerBarComponent>(fixture, '.minutes-until-sleep')).toBe('');
  });

  it('should update the template to reflect changes in the keepAwake state', () => {
    // Arrange
    fixture.detectChanges();
    const keepAwakeElement = getElementBySelector<PlayerBarComponent>(fixture, '.keep-awake');
    // Set up a sequence of dummy boolean $enabled values to iterate through
    const testEntries = [ false, true, false, true, false ];

    testEntries.forEach(enabled => {
      // Act: Emit the test entry and detect changes to update the template
      keepAwakeServiceSpy.enabled$.next(enabled);
      fixture.detectChanges();
      // The keep awake element should have the off-white class if it's disabled and vice-versa
      expect(keepAwakeElement.classList.contains('off-white')).toBe(!enabled);
    });
  });
});
