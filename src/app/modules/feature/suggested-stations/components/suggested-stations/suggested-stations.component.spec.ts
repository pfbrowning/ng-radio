import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SuggestedStationsComponent } from './suggested-stations.component';
import { SuggestedStationsSectionComponent } from '../suggested-stations-section/suggested-stations-section.component';
import { StationThumbnailComponent } from '../station-thumbnail/station-thumbnail.component';
import { provideMockStore } from '@ngrx/store/testing';
import { initialSuggestedStationsRootState } from '../../models/initial-suggested-stations-root-state';

describe('SuggestedStationsComponent', () => {
    let component: SuggestedStationsComponent;
    let fixture: ComponentFixture<SuggestedStationsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                SuggestedStationsComponent,
                SuggestedStationsSectionComponent,
                StationThumbnailComponent,
            ],
            providers: [
                provideMockStore({
                    initialState: initialSuggestedStationsRootState,
                }),
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SuggestedStationsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
