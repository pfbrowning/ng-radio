import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { PlayerBarComponent } from './player-bar.component';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { getElementTextBySelector } from '@utilities/testing';
import { Station } from '@core/models/player';
import { CoreSpyFactories } from '@core/testing';
import { MatProgressButtonsModule } from 'mat-progress-buttons';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PlayerBarFacadeService } from '@core/store';
import { PlayerBarStationInfoStubComponent } from '../../testing/stubs/player-bar-station-info-stub.component.spec';
import { SleepTimerService } from '@core/services';
import { ChangeDetectionStrategy } from '@angular/core';
import { Observable, defer, BehaviorSubject } from 'rxjs';

describe('PlayerBarComponent', () => {
  let component: PlayerBarComponent;
  let fixture: ComponentFixture<PlayerBarComponent>;
  let sleepTimerService: jasmine.SpyObj<SleepTimerService>;
  let minutesUntilSleep$: Observable<number>;

  beforeEach(
    waitForAsync(() => {
      sleepTimerService = CoreSpyFactories.createSleepTimerServiceSpy();
      sleepTimerService.minutesToSleep$ = defer(() => minutesUntilSleep$);

      TestBed.configureTestingModule({
        declarations: [PlayerBarComponent, PlayerBarStationInfoStubComponent],
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
          NoopAnimationsModule,
          MatProgressSpinnerModule,
          MatProgressButtonsModule.forRoot(),
        ],
        providers: [
          {
            provide: PlayerBarFacadeService,
            useValue: CoreSpyFactories.createPlayerBarFacadeSpy(),
          },
          { provide: SleepTimerService, useValue: sleepTimerService },
        ],
      })
        .overrideComponent(PlayerBarComponent, {
          set: { changeDetection: ChangeDetectionStrategy.Default },
        })
        .compileComponents();
    })
  );

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
    const minutesUntilSleep = new BehaviorSubject<number>(null);
    minutesUntilSleep$ = minutesUntilSleep.asObservable();
    for (let i = 300; i >= 0; i--) {
      // Act
      minutesUntilSleep.next(i);
      fixture.detectChanges();

      // Assert: Ensure that the new value was rendered properly in the template
      expect(getElementTextBySelector<PlayerBarComponent>(fixture, '.minutes-until-sleep')).toBe(
        i.toString()
      );
    }

    /* Clear the sleep timer and ensure that 'minutes until sleep'
    no longer shows a number. */
    minutesUntilSleep.next(null);
    fixture.detectChanges();
    expect(getElementTextBySelector<PlayerBarComponent>(fixture, '.minutes-until-sleep')).toBe('');
  });
});
