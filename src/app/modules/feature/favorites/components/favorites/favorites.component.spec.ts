import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FavoritesComponent } from './favorites.component';
import { initialRootState } from '@root-state';
import { provideMockStore } from '@ngrx/store/testing';
import { PlayerService } from '@core';
import { createPlayerServiceSpy } from '@core/testing';
import { ConfirmationService } from 'primeng/api';

describe('FavoritesComponent', () => {
  let component: FavoritesComponent;
  let fixture: ComponentFixture<FavoritesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FavoritesComponent ],
      providers: [
        provideMockStore({ initialState: initialRootState }),
        { provide: PlayerService, useValue: createPlayerServiceSpy() },
        { provide: ConfirmationService, useValue: jasmine.createSpyObj('confirmationService', ['confirm']) }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FavoritesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
