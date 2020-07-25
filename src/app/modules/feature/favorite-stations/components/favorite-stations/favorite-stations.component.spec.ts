import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FavoriteStationsComponent } from './favorite-stations.component';
import { provideMockStore } from '@ngrx/store/testing';
import { initialRootState } from '@core';
import { ConfirmationService } from 'primeng/api';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';

describe('FavoriteStationsComponent', () => {
  let component: FavoriteStationsComponent;
  let fixture: ComponentFixture<FavoriteStationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FavoriteStationsComponent ],
      imports: [
        MatTableModule,
        MatIconModule
      ],
      providers: [
        provideMockStore({initialState: initialRootState}),
        { provide: ConfirmationService, useValue: jasmine.createSpyObj('confirmationService', ['confirm']) }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FavoriteStationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
